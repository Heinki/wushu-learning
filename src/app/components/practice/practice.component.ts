import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import {
  MistakeItem,
  Question,
  TechniqueQuestionData,
} from '../../interfaces/question';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ALL_TECHNIQUES_CATEGORY,
  TECHNIQUE_CATEGORIES,
} from '../../constants/technique-categories';
import { MistakeStorageService } from '../../services/mistake-storage.service';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss',
})
export class PracticeComponent {
  private translate = inject(TranslateService);

  get categories(): string[] {
    return [
      ...TECHNIQUE_CATEGORIES.map((category) =>
        this.translate.instant(category.translationKey)
      ),
      this.translate.instant(ALL_TECHNIQUES_CATEGORY.translationKey),
    ];
  }

  questions: Question[] = [];
  currentQuestion: Question | null = null;
  currentIndex = 0;
  totalQuestions = 0;
  userAnswer = '';
  isCorrect: boolean | null = null;
  isLoading = false;
  showOverview = true;
  answeredCount = 0;
  remainingCount = 0;
  questionQueue: Question[] = [];
  checkDisabled = false;
  showCorrectAnswer = false;
  answerHistory: { question: string; correct: boolean; userAnswer: string }[] =
    [];
  showSummary = false;

  private readonly amountOfQuestions = 15;

  constructor(
    private http: HttpClient,
    private mistakeStorage: MistakeStorageService
  ) {}

  selectCategory(translatedCategory: string): void {
    const originalCategory = this.getOriginalCategoryKey(translatedCategory);

    this.isLoading = true;
    this.questions = [];
    this.currentQuestion = null;
    this.showOverview = false;
    this.answeredCount = 0;
    this.remainingCount = this.amountOfQuestions;
    this.questionQueue = [];
    this.checkDisabled = false;
    this.showCorrectAnswer = false;

    if (originalCategory === 'All') {
      const subCategories = TECHNIQUE_CATEGORIES.map(
        (category) => category.directory
      );
      const currentLang = this.translate.currentLang || 'en';
      const requests = subCategories.map((cat) =>
        this.http
          .get<string[]>(`assets/data/${currentLang}/${cat}/index.json`)
          .pipe(
            map((files) =>
              files.map((file) => `assets/data/${currentLang}/${cat}/${file}`)
            ),
            catchError(() => of([]))
          )
      );

      forkJoin(requests).subscribe((responses) => {
        const allFiles = responses.flat();
        this.loadQuestions(allFiles);
      });
    } else {
      const currentLang = this.translate.currentLang || 'en';
      const selectedCategory = TECHNIQUE_CATEGORIES.find(
        (category) => category.key === originalCategory
      );

      if (!selectedCategory) {
        this.isLoading = false;
        this.showOverview = true;
        return;
      }

      const path = `assets/data/${currentLang}/${selectedCategory.directory}/index.json`;
      this.http
        .get<string[]>(path)
        .pipe(
          map((files) =>
            files.map(
              (file) =>
                `assets/data/${currentLang}/${selectedCategory.directory}/${file}`
            )
          ),
          catchError(() => of([]))
        )
        .subscribe((files) => {
          this.loadQuestions(files);
        });
    }
  }

  private getOriginalCategoryKey(translatedCategory: string): string {
    const category = TECHNIQUE_CATEGORIES.find(
      (item) =>
        this.translate.instant(item.translationKey) === translatedCategory
    );

    if (category) {
      return category.key;
    }

    return this.translate.instant(ALL_TECHNIQUES_CATEGORY.translationKey) ===
      translatedCategory
      ? ALL_TECHNIQUES_CATEGORY.key
      : translatedCategory;
  }

  loadQuestions(files: string[]): void {
    this.questions = [];
    this.questionQueue = [];
    this.answeredCount = 0;
    this.remainingCount = this.amountOfQuestions;
    this.checkDisabled = false;
    this.showCorrectAnswer = false;
    this.answerHistory = [];

    const requests = files.map((file) =>
      this.http
        .get<TechniqueQuestionData>(file)
        .pipe(catchError(() => of(null)))
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((data) => {
          if (data && Array.isArray(data.questions)) {
            data.questions.forEach((q: Question) => {
              q.techniqueData = {
                code: data.code,
                technique_name: data.technique_name,
                category: data.category,
                deduction_points: data.deduction_content || [],
              };
            });
            this.questions = [...this.questions, ...data.questions];
          }
        });
        this.questionQueue = this.shuffleArray(this.questions).slice(
          0,
          this.amountOfQuestions
        );
        this.totalQuestions = this.questionQueue.length;
        this.answeredCount = 0;
        this.remainingCount = this.totalQuestions;
        this.getNextQuestion();
        this.isLoading = false;
        this.showOverview = false;
      },
      error: () => {
        this.isLoading = false;
        this.showOverview = true;
      },
    });
  }

  getNextQuestion(): void {
    if (this.questionQueue.length > 0) {
      this.currentQuestion = this.questionQueue.shift() ?? null;
      this.userAnswer = '';
      this.isCorrect = null;
      this.checkDisabled = false;
      this.showCorrectAnswer = false;
      this.currentIndex = this.answeredCount + 1;
    } else {
      this.currentQuestion = null;
      this.showSummary = true;
    }
  }

  checkAnswer(): void {
    if (this.checkDisabled || !this.currentQuestion) return;

    if (!this.userAnswer) return;

    this.isCorrect = this.userAnswer === this.currentQuestion.answer;
    this.showCorrectAnswer = !this.isCorrect;
    this.checkDisabled = true;
    this.answeredCount++;
    this.remainingCount = this.totalQuestions - this.answeredCount;
    this.answerHistory.push({
      question: this.currentQuestion.question,
      correct: this.isCorrect,
      userAnswer: this.userAnswer,
    });

    if (!this.isCorrect && this.currentQuestion.techniqueData) {
      this.saveMistake();
    }
  }

  saveMistake(): void {
    if (!this.currentQuestion || !this.currentQuestion.techniqueData) return;

    const techniqueData = this.currentQuestion.techniqueData;

    const mistake: MistakeItem = {
      question: this.currentQuestion.question,
      answer: this.currentQuestion.answer,
      technique_code: techniqueData.code,
      technique_name: techniqueData.technique_name,
      category: techniqueData.category,
      deduction_points: techniqueData.deduction_points,
      count: 1,
      original_technique_code: techniqueData.code,
    };

    this.mistakeStorage.save(mistake);
  }

  nextQuestion(): void {
    this.getNextQuestion();
  }

  shuffleArray(array: Question[]): Question[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  resetPractice(): void {
    this.showOverview = true;
    this.questions = [];
    this.currentQuestion = null;
    this.currentIndex = 0;
    this.totalQuestions = 0;
    this.userAnswer = '';
    this.isCorrect = null;
    this.isLoading = false;
    this.answeredCount = 0;
    this.remainingCount = 0;
    this.questionQueue = [];
    this.checkDisabled = false;
    this.showCorrectAnswer = false;
    this.answerHistory = [];
    this.showSummary = false;
  }
}
