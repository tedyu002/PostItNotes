import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { PostItNote } from './post-it-note';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesService implements OnInit {
  sequence_number: number = 0;

  itemChangeEvent: EventEmitter<PostItNote> = new EventEmitter<PostItNote>();
  itemDeleteEvent: EventEmitter<PostItNote> = new EventEmitter<PostItNote>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
  
  insert(note: PostItNote): PostItNote {
    note.id = ((new Date()).getTime()) + "" + this.sequence_number;
    this.sequence_number += 1;

    localStorage.setItem(note.id, JSON.stringify(note));

    this.itemChangeEvent.emit(note);

    return note;
  }

  update(note: PostItNote): void {
    localStorage.setItem(note.id, JSON.stringify(note));

    this.itemChangeEvent.emit(note);
  }

  del(note: PostItNote): void {
    localStorage.removeItem(note.id);

    this.itemDeleteEvent.emit(note);
  }

  list(): Array<PostItNote> {
    let notes = Array<PostItNote>();
    let notes_len = localStorage.length;

    for (let i = 0; i < notes_len; ++i) {
      let key = localStorage.key(i);

      let item:PostItNote = JSON.parse(localStorage.getItem(key)) as PostItNote;

      notes.push(item);
    }

    return notes;
  }
}
