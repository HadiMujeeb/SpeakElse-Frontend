import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageTestService } from '../../../core/services/admin/language-test.service';
import { IQuestions } from '../../../shared/models/languageTests.model';

@Component({
  selector: 'app-language-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-test.component.html',
  styleUrls: ['./language-test.component.css'],
})
export class LanguageTestComponent implements OnInit {
  totalTests = 0;
  activeTests = 0;
  activeTestType = 'READING';
  isModalOpen = false;
  isAddTestModalOpen = false;
  modalContent = 'story';
  questions: IQuestions[] = [];
  TypeQuestions: IQuestions[] = [];
  selectedQuestion: IQuestions | null = null;
  LanguageTestService = inject(LanguageTestService);

  // Pagination properties
  page = 1;
  pageSize = 10;
  filteredMembersPaginated: IQuestions[] = [];

  headers = [
    { label: 'ID' },
    { label: 'Story Name' },
    { label: 'Story' },
    { label: 'Type' },
    { label: 'Actions' },
    { label: 'Delete' },
  ];

  newQuestion: IQuestions = {
    testType: '',
    title: '',
    story: '',
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ],
  };

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.LanguageTestService.getAllQuestions().subscribe((res: any) => {
      this.questions = res?.data;
      this.filterTests(this.activeTestType);
    });
  }

  filterTests(type: string): void {
    this.activeTestType = type;
    this.TypeQuestions = this.questions.filter((test) => test.testType == type);
    this.page = 1; // Reset to first page when filtering
    this.updatePaginatedMembers();
  }

  questionsDetails(id: any): void {
    this.selectedQuestion = this.questions.filter((question) => question.id === id)[0];
    this.isModalOpen = true;
    this.modalContent = 'story';
  }

  showQuestions(): void {
    this.modalContent = 'questions';
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  isopenAddTestModal(): void {
    this.isAddTestModalOpen = !this.isAddTestModalOpen;
    this.newQuestion = {
      testType: '',
      title: '',
      story: '',
      questions: [
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        },
      ],
    };
  }

  addQuestion(): void {
    this.newQuestion.questions.push({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
  }

  addTest(): void {
    console.log(this.newQuestion);
  }

  deleteQuestion(id: string): void {
    this.LanguageTestService.removeQuestion(id).subscribe((res) => {
      console.log('Deleted:', res);
      const type = this.questions.find((data) => data.id == id)?.testType;
      this.questions = this.questions.filter((question) => question.id !== id);
      if (type) this.filterTests(type);
    });
  }

  logNewQuestion(): void {
    console.log(this.newQuestion);
  }

  requestAddQuestion(): void {
    this.LanguageTestService.addQuestion(this.newQuestion).subscribe((res) => {
      this.questions.push(res.question);
      this.filterTests(res.question.testType);
      this.isopenAddTestModal();
    });
  }

  updatePaginatedMembers(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    this.filteredMembersPaginated = this.TypeQuestions.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get totalPages(): number {
    return Math.ceil(this.TypeQuestions.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedMembers();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePaginatedMembers();
    }
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.updatePaginatedMembers();
    }
  }
}