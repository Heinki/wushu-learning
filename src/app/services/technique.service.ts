import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber, catchError, map, of } from 'rxjs';

export interface Technique {
  category: string;
  technique_name: string;
  deduction_content: string[];
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class TechniqueService {
  private directories = ['hand-forms', 'balance', 'leg-techniques'];
  private techniqueCache = new Map<string, Technique>();

  constructor(private http: HttpClient) {}

  /**
   * Get a technique by its code
   * @param code The technique code (e.g., '01', '02')
   */
  getTechniqueByCode(code: string): Observable<Technique | null> {
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
  getAllTechniques(): Observable<Technique[]> {
    const allTechniques: Technique[] = [];

    // Return cached techniques if we have them
    if (this.techniqueCache.size > 0) {
      return of(Array.from(this.techniqueCache.values()));
    }

    // Otherwise load from all directories
    return this.loadAllTechniques();
  }

  private searchTechniqueInDirectories(
    code: string
  ): Observable<Technique | null> {
    return new Observable<Technique | null>((observer) => {
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
    observer: Subscriber<Technique | null>
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
        .get<Technique>(url)
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

  private loadAllTechniques(): Observable<Technique[]> {
    return new Observable<Technique[]>((observer) => {
      const techniques: Technique[] = [];
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
    techniques: Technique[],
    observer: Subscriber<Technique[]>
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
        .get<Technique>(url)
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
