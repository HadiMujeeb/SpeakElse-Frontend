import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthUserService } from '../../core/services/user/auth-user.service';
import { Observable, Subscription } from 'rxjs';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterModule, HeaderComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent  {
  
}
