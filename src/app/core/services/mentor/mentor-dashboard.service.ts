import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MentorDashboardService {
 private api: string = `${environment.BACKEND_DOMAIN}/api/mentor`;
  constructor(private httpClient: HttpClient) {}

}
