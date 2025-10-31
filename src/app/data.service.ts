import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { Model } from './model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject<Model>( new Model());
  currentMessage = this.messageSource.asObservable();
  
  model : Model = new Model();

  constructor() { }

  changeMessage(message: Model) {
    this.messageSource.next(message)
  }
  
  getModel(): Observable<Model> {
    return this.currentMessage;
  }

}
