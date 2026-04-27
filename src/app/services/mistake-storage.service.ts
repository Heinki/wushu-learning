import { Injectable } from '@angular/core';
import { MistakeItem } from '../interfaces/question';

const STORAGE_KEY = 'wushu-mistakes';

@Injectable({
  providedIn: 'root',
})
export class MistakeStorageService {
  getAll(): MistakeItem[] {
    try {
      const mistakesJson = localStorage.getItem(STORAGE_KEY);
      const mistakes = mistakesJson ? JSON.parse(mistakesJson) : [];

      return Array.isArray(mistakes) ? mistakes : [];
    } catch {
      return [];
    }
  }

  save(mistake: MistakeItem): void {
    const mistakes = this.getAll();
    const existing = mistakes.find(
      (item) =>
        item.technique_code === mistake.technique_code &&
        item.question === mistake.question
    );

    if (existing) {
      existing.count += 1;
    } else {
      mistakes.push(mistake);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
