import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesBoardService {
  boardMovingEvent: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();


  constructor() { }
}
