import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { TechniqueQuestionData } from '../interfaces/question';

@Injectable({
  providedIn: 'root',
})
export class TechniqueService {
  private readonly directories = ['hand-forms', 'balance', 'leg-techniques'];
  private techniqueCache = new Map<string, TechniqueQuestionData>();

  constructor(private http: HttpClient) {}

  getTechniqueByCode(code: string): Observable<TechniqueQuestionData | null> {
    if (this.techniqueCache.has(code)) {
      return of(this.techniqueCache.get(code) || null);
    }
    return this.fetchTechniqueByCode(code);
  }

  getAllTechniques(): Observable<TechniqueQuestionData[]> {
    if (this.techniqueCache.size > 0) {
      return of(Array.from(this.techniqueCache.values()));
    }
    return this.fetchAllTechniques();
  }

  private fetchTechniqueByCode(
    code: string
  ): Observable<TechniqueQuestionData | null> {
    return this.getFilePaths().pipe(
      switchMap((filePaths) =>
        forkJoin(this.createTechniqueRequests(filePaths))
      ),
      map((techniques) => {
        const technique = techniques.find((t) => t?.code === code);
        if (technique) {
          this.techniqueCache.set(code, technique);
        }
        return technique || null;
      })
    );
  }

  private fetchAllTechniques(): Observable<TechniqueQuestionData[]> {
    return this.getFilePaths().pipe(
      switchMap((filePaths) =>
        forkJoin(this.createTechniqueRequests(filePaths))
      ),
      map((techniques) => {
        const validTechniques = techniques.filter(
          (t): t is TechniqueQuestionData => t !== null
        );
        validTechniques.forEach((technique) => {
          this.techniqueCache.set(technique.code, technique);
        });
        return validTechniques;
      })
    );
  }

  private getFilePaths(): Observable<Array<{ dir: string; file: string }>> {
    const directoryRequests = this.directories.map((dir) =>
      this.getDirectoryFiles(dir).pipe(
        map((files) =>
          files
            .filter((file) => file.endsWith('.json') && file !== 'index.json')
            .map((file) => ({ dir, file }))
        )
      )
    );

    return forkJoin(directoryRequests).pipe(map((results) => results.flat()));
  }

  private getDirectoryFiles(dir: string): Observable<string[]> {
    const url = `assets/data/${encodeURIComponent(dir)}/index.json`;
    return this.http.get<string[]>(url).pipe(map((files) => files || []));
  }

  private createTechniqueRequests(
    filePaths: Array<{ dir: string; file: string }>
  ): Observable<TechniqueQuestionData | null>[] {
    return filePaths.map(({ dir, file }) => {
      const url = `assets/data/${encodeURIComponent(dir)}/${encodeURIComponent(
        file
      )}`;
      return this.http
        .get<TechniqueQuestionData>(url)
        .pipe(map((technique) => technique || null));
    });
  }
}
