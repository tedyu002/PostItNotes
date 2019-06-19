import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { PostItNote } from './post-it-note';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesService implements OnInit {
  sequence_number: number = 0;

  itemInsertEvent: EventEmitter<PostItNote> = new EventEmitter<PostItNote>();
  itemChangeEvent: EventEmitter<PostItNote> = new EventEmitter<PostItNote>();
  itemDeleteEvent: EventEmitter<PostItNote> = new EventEmitter<PostItNote>();
  notes: Array<PostItNote> = new Array<PostItNote>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
  
  insert(note: PostItNote): PostItNote {
    note.id = ((new Date()).getTime()) + "" + this.sequence_number;
    this.sequence_number += 1;

    localStorage.setItem(note.id, JSON.stringify(note));

    this.notes.push(note);

    this.itemInsertEvent.emit(note);

    return note;
  }

  update(note: PostItNote): void {
    localStorage.setItem(note.id, JSON.stringify(note));

    for (let i = 0; i < this.notes.length; ++i) {
      if (this.notes[i].id == note.id) {
        this.notes[i] = note;
        break;
      }
    }

    this.itemChangeEvent.emit(note);
  }

  del(note: PostItNote): void {
    localStorage.removeItem(note.id);

    for (let i = 0; i < this.notes.length; ++i) {
      if (this.notes[i].id == note.id) {
        this.notes.splice(i, 1);
        break;
      }
    }

    this.itemDeleteEvent.emit(note);
  }

  list(): Array<PostItNote> {
    if (this.notes.length == 0) {
      let notes = Array<PostItNote>();
      let notes_len = localStorage.length;

      for (let i = 0; i < notes_len; ++i) {
        let key = localStorage.key(i);

        let item:PostItNote = JSON.parse(localStorage.getItem(key)) as PostItNote;
        delete item.isNew;

        this.notes.push(item);
      }
    }

    return this.notes;
  }

  assignMaxZIndex(assignNote: PostItNote): void {
    let max_zindex = 0;

    for (let note of this.list()) {
      if (note.zindex && assignNote.id != note.id && note.zindex > max_zindex) {
        max_zindex = note.zindex;
      }
    }

    assignNote.zindex = max_zindex + 1;
  }
}
