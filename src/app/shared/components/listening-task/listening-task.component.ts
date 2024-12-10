import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IQuestions } from '../../models/languageTests.model';
import { UserProfileService } from '../../../core/services/user/user-profile.service';

@Component({
  selector: 'app-listening-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listening-task.component.html',
  styleUrls: ['./listening-task.component.css']
})
export class ListeningTaskComponent implements OnInit {
  testStarted: boolean = false; 
  sanitizedVideoUrl: any; 
  questions: any[] = []; 
  currentQuestionIndex: number = 0;
  progress: number = 0; 
  timer: any; 
  remainingTime: number = 420; 
  formattedTime: string = '';
  finished: boolean = false; 
  score: number = 0;
  Questions:IQuestions[] = [];
  currentQuestion: IQuestions|null = null;
  isAnswer: boolean = false
  router = inject(Router)
  userProfileServices = inject(UserProfileService)
  videoUrl: SafeResourceUrl = '';
  constructor(private sanitizer: DomSanitizer) {}
  ngOnInit() {
    this.userProfileServices.getAllQuestions().subscribe((questions:any) => {
      this.Questions = questions.data.filter((question: IQuestions) => question.testType === 'LISTENING');
      console.log(this.Questions);
      this.getRandomQuestion();
    })
   
  }
  getRandomQuestion() {
    const randomIndex = Math.floor(Math.random()*this.Questions.length);
    console.log(randomIndex);
    this.currentQuestion = this.Questions[randomIndex];
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentQuestion.story);
    console.log(this.currentQuestion);
  }


  startTest(): void {
    this.testStarted = true;
    this.currentQuestionIndex = 0;
    this.progress = 0;
    this.finished = false;
    this.score = 0;
    this.startTimer();
  }

  startTimer(): void {
    this.updateTimeDisplay();
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.updateTimeDisplay();
        this.updateProgress();
      } else {
        this.finishTest();
      }
    }, 1000); 
  }

  updateTimeDisplay(): void {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.formattedTime = `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  updateProgress(): void {
    this.progress = ((300 - this.remainingTime) / 300) * 100;
  }

  answerQuestion(correctAnswer: number, optionIndex: number) {
    console.log(correctAnswer, optionIndex);
    if(correctAnswer == optionIndex){
      this.isAnswer = true;
    }else{
      this.isAnswer = false;}
   }
  
  nextQuestion() {
    if(this.isAnswer){
      this.score++;
      console.log(this.score);
     this.userProfileServices.updateListeningTestScore(this.score);
      this.isAnswer = false
    }
  if (this.currentQuestion &&this.currentQuestionIndex < this.currentQuestion.questions.length - 1) {
    this.currentQuestionIndex++;
  } else {
    this.finished = true; 
  }
}

  finishTest(): void {
    clearInterval(this.timer);
    this.finished = true;
  }


  submitTest(): void { 
   this.router.navigate(['/user/test/scorePage']);
  }
}
