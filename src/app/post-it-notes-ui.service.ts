import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesUIService {
  boardMovingEvent: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();


  constructor() { }
}
