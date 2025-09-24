import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { TechniqueQuestionData } from '../../interfaces/question.model';
import { Question } from '../../interfaces/question.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss',
})
export class PracticeComponent {
  private translate = inject(TranslateService);

  private categoryKeys = ['Balance', 'Hand Forms', 'Leg Techniques', 'All'];

  get categories(): string[] {
    return this.categoryKeys.map((key) => {
      switch (key) {
        case 'Balance':
          return this.translate.instant('practice.categories.balance');
        case 'Hand Forms':
          return this.translate.instant('practice.categories.handForms');
        case 'Leg Techniques':
          return this.translate.instant('practice.categories.legTechniques');
        case 'All':
          return this.translate.instant('practice.categories.all');
        default:
          return key;
      }
    });
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
  showSummary: boolean = false;

  private AMOUNT_OF_QUESTIONS: number = 15;

  constructor(private http: HttpClient) {}

  selectCategory(translatedCategory: string) {
    const originalCategory = this.getOriginalCategoryKey(translatedCategory);

    this.isLoading = true;
    this.questions = [];
    this.currentQuestion = null;
    this.showOverview = false;
    this.answeredCount = 0;
    this.remainingCount = this.AMOUNT_OF_QUESTIONS;
    this.questionQueue = [];
    this.checkDisabled = false;
    this.showCorrectAnswer = false;

    if (originalCategory === 'All') {
      const subCategories = ['balance', 'hand-forms', 'leg-techniques'];
      const requests = subCategories.map((cat) =>
        this.http.get<string[]>(`assets/data/${cat}/index.json`).pipe(
          map((files) => files.map((file) => `assets/data/${cat}/${file}`)),
          catchError(() => of([]))
        )
      );

      forkJoin(requests).subscribe((responses) => {
        const allFiles = responses.flat();
        this.loadQuestions(allFiles);
      });
    } else {
      const path = `assets/data/${originalCategory
        .toLowerCase()
        .replace(' ', '-')}/index.json`;
      this.http
        .get<string[]>(path)
        .pipe(
          map((files) =>
            files.map(
              (file) =>
                `assets/data/${originalCategory
                  .toLowerCase()
                  .replace(' ', '-')}/${file}`
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
    switch (translatedCategory) {
      case this.translate.instant('practice.categories.balance'):
        return 'Balance';
      case this.translate.instant('practice.categories.handForms'):
        return 'Hand Forms';
      case this.translate.instant('practice.categories.legTechniques'):
        return 'Leg Techniques';
      case this.translate.instant('practice.categories.all'):
        return 'All';
      default:
        return translatedCategory;
    }
  }

  loadQuestions(files: string[]) {
    this.questions = [];
    this.questionQueue = [];
    this.answeredCount = 0;
    this.remainingCount = this.AMOUNT_OF_QUESTIONS;
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
          this.AMOUNT_OF_QUESTIONS
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

  getNextQuestion() {
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

  checkAnswer() {
    if (this.checkDisabled || !this.currentQuestion) return;
    const normalize = (str: string) => str.trim().toLowerCase();
    const tokenize = (str: string) => normalize(str).split(/\s+/);
    const userTokens = tokenize(this.userAnswer);
    const correctTokens = tokenize(this.currentQuestion.answer);
    let overlap = 0;
    correctTokens.forEach((token) => {
      if (userTokens.includes(token)) overlap++;
    });
    const percent =
      correctTokens.length > 0 ? overlap / correctTokens.length : 0;
    this.isCorrect = percent >= 0.7;
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

  saveMistake() {
    if (!this.currentQuestion || !this.currentQuestion.techniqueData) return;

    const techniqueData = this.currentQuestion.techniqueData;

    const mistake = {
      question: this.currentQuestion.question,
      answer: this.currentQuestion.answer,
      technique_code: techniqueData.code,
      technique_name: techniqueData.technique_name,
      category: techniqueData.category,
      deduction_points: techniqueData.deduction_points,
      count: 1,
      original_technique_code: techniqueData.code,
    };

    const mistakesJson = localStorage.getItem('wushu-mistakes');
    let mistakes = mistakesJson ? JSON.parse(mistakesJson) : [];

    const existingIndex = mistakes.findIndex(
      (m: Question) =>
        m.techniqueData?.code === mistake.technique_code &&
        m.question === mistake.question
    );

    if (existingIndex !== -1) {
      mistakes[existingIndex].count += 1;
    } else {
      mistakes.push(mistake);
    }

    localStorage.setItem('wushu-mistakes', JSON.stringify(mistakes));
    console.log('Mistake saved:', mistake);
  }

  nextQuestion() {
    this.getNextQuestion();
  }

  shuffleArray(array: Question[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  resetPractice() {
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
