import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { IQuestions } from '../../models/languageTests.model';

@Component({
  selector: 'app-reading-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reading-test.component.html',
  styleUrl: './reading-test.component.css'
})
export class ReadingTestComponent implements OnInit , OnDestroy{
  testStarted: boolean = false;
  timeLeft: number = 420; // 7 minutes = 420 seconds
  interval: any;
  progress: number = 0; // Progress bar value (0 to 100)
  score: number = 0;
  currentQuestion: IQuestions|null = null;
  currentQuestionIndex: number = 0;
  userAnswers: string[] = [];
  finished: boolean = false;
  Questions:IQuestions[] = [];
  isAnswer: boolean = false;
  router = inject(Router)
  userProfileServices = inject(UserProfileService)
  ngOnInit() {
    this.userProfileServices.getAllQuestions().subscribe((questions:any) => {
      this.Questions = questions.data.filter((questions:IQuestions)=> questions.testType === 'READING');
      this.getRandomQuestion();
    })
   
  }

  getRandomQuestion() {
    const randomIndex = Math.floor(Math.random()*this.Questions.length);
    this.currentQuestion = this.Questions[randomIndex];
  }

  startTest() {
    this.testStarted = true; 
    this.startTimer(); 
  }

  ngOnDestroy() {
    clearInterval(this.interval); 
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.progress = ((420 - this.timeLeft) / 420) * 100;
      } else {
        clearInterval(this.interval);
        this.router.navigate(['/user/test/listeningTask']);
      }
    }, 1000);
  }

  nextQuestion() {
      if(this.isAnswer){
        this.score++;
       this.userProfileServices.updateReadingTestScore(this.score);
        this.isAnswer = false
      }
    if (this.currentQuestion &&this.currentQuestionIndex < this.currentQuestion.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finished = true; 
    }
  }


  answerQuestion(correctAnswer: number, optionIndex: number) {
   if(correctAnswer === optionIndex){
     this.isAnswer = true;
   }else{
     this.isAnswer = false;}
  }


  get formattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  submitTest() {
    // this.userProfileServices.upateReadingTime(`${this.timeLeft}`);
    this.router.navigate(['/user/test/listeningTask']);
  }
}
