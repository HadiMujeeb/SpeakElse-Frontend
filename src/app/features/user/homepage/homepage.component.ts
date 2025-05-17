import { Component} from '@angular/core';
import { FooterComponent } from '../../../layouts/user/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../layouts/user/header/header.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterModule, HeaderComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent{


}
