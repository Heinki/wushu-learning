import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss',
})
export class PracticeComponent {
  categories = ['Balance', 'Hand Forms', 'Leg Techniques', 'All'];
  questions: any[] = [];
  currentQuestion: any;
  currentIndex = 0;
  totalQuestions = 0;
  userAnswer = '';
  isCorrect: boolean | null = null;
  isLoading = false;
  showOverview = true;
  answeredCount = 0;
  remainingCount = 0;
  questionQueue: any[] = [];
  checkDisabled = false;
  showCorrectAnswer = false;
  answerHistory: { question: string; correct: boolean; userAnswer: string }[] =
    [];
  showSummary: boolean = false;

  constructor(private http: HttpClient) {}

  selectCategory(category: string) {
    this.isLoading = true;
    this.questions = [];
    this.currentQuestion = null;
    this.showOverview = false;
    this.answeredCount = 0;
    this.remainingCount = 15;
    this.questionQueue = [];
    this.checkDisabled = false;
    this.showCorrectAnswer = false;

    if (category === 'All') {
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
      const path = `assets/data/${category
        .toLowerCase()
        .replace(' ', '-')}/index.json`;
      this.http
        .get<string[]>(path)
        .pipe(
          map((files) =>
            files.map(
              (file) =>
                `assets/data/${category
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

  loadQuestions(files: string[]) {
    this.questions = [];
    this.questionQueue = [];
    this.answeredCount = 0;
    this.remainingCount = 15;
    this.checkDisabled = false;
    this.showCorrectAnswer = false;
    this.answerHistory = [];

    const requests = files.map((file) =>
      this.http.get<any>(file).pipe(catchError(() => of(null)))
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((data) => {
          if (data && Array.isArray(data.questions)) {
            this.questions = [...this.questions, ...data.questions];
          }
        });
        // Shuffle and pick 15 random questions
        this.questionQueue = this.shuffleArray(this.questions).slice(0, 15);
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
      this.currentQuestion = this.questionQueue.shift();
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
    const user = normalize(this.userAnswer);
    const correct = normalize(this.currentQuestion.answer);
    const userTokens = tokenize(this.userAnswer);
    const correctTokens = tokenize(this.currentQuestion.answer);
    // Token overlap: require at least 70% of correct tokens to be present in user answer
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
  }

  nextQuestion() {
    this.getNextQuestion();
  }

  shuffleArray(array: any[]) {
    // Fisher-Yates shuffle
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
