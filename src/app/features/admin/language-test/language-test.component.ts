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
    this.LanguageTestService.getAllQuestions().subscribe((res: any) => {
      this.questions = res?.data;
      this.TypeQuestions = res?.data.filter((test: IQuestions) => test.testType == this.activeTestType);
    });
  }

  filterTests(type: string) {
    console.log(type);
    this.activeTestType = type;
    this.TypeQuestions = this.questions.filter((test) => test.testType == type);
    
  }

  questionsDetails(id: any) {
    this.selectedQuestion = this.questions.filter((question) => question.id === id)[0];
    this.isModalOpen = true;
    this.modalContent = 'story';
  }

  showQuestions() {
    this.modalContent = 'questions';
  }

  closeModal() {
    this.isModalOpen = false;
  }

  isopenAddTestModal() {
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

  addQuestion() {
    this.newQuestion.questions.push({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
  }

  addTest() {
  
    console.log(this.newQuestion);
  }

  deleteQuestion(id: string) {
    this.LanguageTestService.removeQuestion(id).subscribe((res) => {
      console.log('Deleted:', res);
      this.questions = this.questions.filter((question) => question.id !== id);
    });
  }

  logNewQuestion() {
    console.log(this.newQuestion);
  }

  requestAddQuestion() {
  this.LanguageTestService.addQuestion(this.newQuestion).subscribe((res: any) => {
    console.log('Test added:', res);
    this.questions.push(res.data);
    this.isopenAddTestModal();
  })
  }


}
