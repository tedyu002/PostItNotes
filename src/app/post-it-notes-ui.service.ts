import { Injectable, EventEmitter } from '@angular/core';
import { PostItNote } from './post-it-note';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesUIService {
  boardMovingEvent: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

  _selectedNote: PostItNoteUI;

  constructor() {
  }

  wrapArray(notes: Array<PostItNote>): Array<PostItNoteUI> {
    let ret_notes: Array<PostItNoteUI> = new Array<PostItNoteUI>()

    for (let note of notes) {
      ret_notes.push(this.wrap(note));
    }

    return ret_notes as Array<PostItNoteUI>;
  }

  wrap(note: PostItNote): PostItNoteUI {
    let note_ui = new PostItNoteUI();

    note_ui.note = note;
    note_ui.shadowNote = Object.assign({}, note_ui) as PostItNoteUI;

    return note_ui;
  }

  set selectedNote(note: PostItNoteUI) {
    if (this._selectedNote) {
      this._selectedNote.selected = false;
      this._selectedNote.changeEvent.emit(this._selectedNote);
    }

    this._selectedNote = note;
    this._selectedNote.selected = true;
    this._selectedNote.changeEvent.emit(this._selectedNote);
  }
}

export class PostItNoteUI extends PostItNote {
  note: PostItNote;
  shadowNote: PostItNote;

  changeEvent: EventEmitter<PostItNoteUI> = new EventEmitter<PostItNoteUI>();

  selected: boolean = false;
  isEditing: boolean = false;

  makeShadow() {
    Object.assign(this.shadowNote, this.note);
  }

  commitShadow() {
    Object.assign(this.note, this.shadowNote);
  }
}
