import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scorepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scorepage.component.html',
  styleUrls: ['./scorepage.component.css']
})
export class ScorepageComponent {

  userProfileServices = inject(UserProfileService);
  listeningScore = 0
  readingScore =0 
  timeTaken: number = 0;
  passMessage = '';
  totalScore: string = '';
  grade = ''; 

  router = inject(Router);

  ngOnInit() {
    this.userProfileServices.listeningTestScore$.subscribe(score => this.listeningScore = score);
    this.userProfileServices.readingTestScore$.subscribe(score => this.readingScore = score);
    this.validateTest();
    this.calculateTotalScore();
    this.determineGrade();
  }

  validateTest() {
    // if (this.listeningScore >= 5 && this.readingScore >= 5 && this.timeTaken <= 30) {
    //   this.passMessage = 'Congratulations! You Passed';
    // } else {
    //   this.passMessage = 'Sorry, you did not pass. Please try again.';
    // }
    return this.listeningScore >= 5 && this.readingScore >= 5
  }

  applyNow() {
    this.router.navigate(['/user/applicationform']);
  }
backToHome() {
  this.router.navigate(['/user/home']);
}
  calculateTotalScore() {
    const total = this.listeningScore + this.readingScore;
    this.totalScore = `${total}/20`; // Assuming maximum score is 10 for each section
  }

  determineGrade() {
    const total = this.listeningScore + this.readingScore;

    if (total >= 18) {
      this.grade = 'A1';
    } else if (total >= 16) {
      this.grade = 'A2';
    } else if (total >= 14) {
      this.grade = 'B1';
    } else if (total >= 12) {
      this.grade = 'B2';
    } else if (total >= 10) {
      this.grade = 'C1';
    } else {
      this.grade = 'C2';
    }
  }
}
