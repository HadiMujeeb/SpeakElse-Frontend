import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestions } from '../../../shared/models/languageTests.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageTestService {
  private api: string = `${environment.BACKEND_DOMAIN}/api/admin/languageTest`;

  constructor(private httpClient: HttpClient) { }


  getAllQuestions(): Observable<IQuestions[]> {
    return this.httpClient.get<IQuestions[]>(`${this.api}/getAllQuestions`);
  }

  addQuestion(data: IQuestions): Observable<IQuestions> {
    return this.httpClient.post<IQuestions>(`${this.api}/addQuestion`, data);
  }

  editQuestion(data: IQuestions): Observable<any> {
    return this.httpClient.put(`${this.api}/editQuestion`, data);
  }

  removeQuestion(id: string): Observable<any> {
    return this.httpClient.delete(`${this.api}/removeQuestion/${id}`);
  }
}
