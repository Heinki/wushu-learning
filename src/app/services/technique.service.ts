import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber, catchError, map, of } from 'rxjs';
import { TechniqueQuestionData } from '../interfaces/question';

@Injectable({
  providedIn: 'root',
})
export class TechniqueService {
  private directories = ['hand-forms', 'balance', 'leg-techniques'];
  private techniqueCache = new Map<string, TechniqueQuestionData>();

  constructor(private http: HttpClient) {}

  /**
   * Get a technique by its code
   * @param code The technique code (e.g., '01', '02')
   */
  getTechniqueByCode(code: string): Observable<TechniqueQuestionData | null> {
    // Check cache first
    if (this.techniqueCache.has(code)) {
      return of(this.techniqueCache.get(code) || null);
    }

    // Try to load from each directory
    return this.searchTechniqueInDirectories(code);
  }

  /**
   * Get all available techniques
   */
  getAllTechniques(): Observable<TechniqueQuestionData[]> {
    const allTechniques: TechniqueQuestionData[] = [];

    // Return cached techniques if we have them
    if (this.techniqueCache.size > 0) {
      return of(Array.from(this.techniqueCache.values()));
    }

    // Otherwise load from all directories
    return this.loadAllTechniques();
  }

  private searchTechniqueInDirectories(
    code: string
  ): Observable<TechniqueQuestionData | null> {
    return new Observable<TechniqueQuestionData | null>((observer) => {
      const filePaths: { dir: string; file: string }[] = [];
      let directoriesProcessed = 0;

      for (const dir of this.directories) {
        const url = `assets/data/${encodeURIComponent(dir)}/index.json`;
        this.http
          .get<string[]>(url)
          .pipe(catchError(() => of([])))
          .subscribe((files) => {
            files.forEach((file) => {
              if (file.endsWith('.json') && file !== 'index.json') {
                filePaths.push({ dir, file });
              }
            });

            directoriesProcessed++;
            if (directoriesProcessed === this.directories.length) {
              this.processFiles(filePaths, code, observer);
            }
          });
      }
    });
  }

  private processFiles(
    filePaths: { dir: string; file: string }[],
    code: string,
    observer: Subscriber<TechniqueQuestionData | null>
  ) {
    if (filePaths.length === 0) {
      observer.next(null);
      observer.complete();
      return;
    }

    let currentIndex = 0;
    const tryNextFile = () => {
      if (currentIndex >= filePaths.length) {
        observer.next(null);
        observer.complete();
        return;
      }

      const { dir, file } = filePaths[currentIndex];
      currentIndex++;

      const url = `assets/data/${encodeURIComponent(dir)}/${encodeURIComponent(
        file
      )}`;

      this.http
        .get<TechniqueQuestionData>(url)
        .pipe(
          map((technique) => {
            if (technique && technique.code === code) {
              this.techniqueCache.set(code, technique);
              return technique;
            }
            return null;
          }),
          catchError(() => of(null))
        )
        .subscribe((technique) => {
          if (technique) {
            observer.next(technique);
            observer.complete();
          } else {
            tryNextFile();
          }
        });
    };

    tryNextFile();
  }

  private loadAllTechniques(): Observable<TechniqueQuestionData[]> {
    return new Observable<TechniqueQuestionData[]>((observer) => {
      const techniques: TechniqueQuestionData[] = [];
      const filePaths: { dir: string; file: string }[] = [];
      let directoriesProcessed = 0;

      for (const dir of this.directories) {
        const url = `assets/data/${encodeURIComponent(dir)}/index.json`;
        this.http
          .get<string[]>(url)
          .pipe(catchError(() => of([])))
          .subscribe((files) => {
            files.forEach((file) => {
              if (file.endsWith('.json') && file !== 'index.json') {
                filePaths.push({ dir, file });
              }
            });

            directoriesProcessed++;
            if (directoriesProcessed === this.directories.length) {
              this.processAllFiles(filePaths, techniques, observer);
            }
          });
      }
    });
  }

  private processAllFiles(
    filePaths: { dir: string; file: string }[],
    techniques: TechniqueQuestionData[],
    observer: Subscriber<TechniqueQuestionData[]>
  ) {
    if (filePaths.length === 0) {
      observer.next([]);
      observer.complete();
      return;
    }

    let completedRequests = 0;

    filePaths.forEach(({ dir, file }) => {
      const url = `assets/data/${encodeURIComponent(dir)}/${encodeURIComponent(
        file
      )}`;

      this.http
        .get<TechniqueQuestionData>(url)
        .pipe(catchError(() => of(null)))
        .subscribe((technique) => {
          completedRequests++;

          if (technique) {
            techniques.push(technique);
            this.techniqueCache.set(technique.code, technique);
          }

          if (completedRequests === filePaths.length) {
            observer.next(techniques);
            observer.complete();
          }
        });
    });
  }
}
