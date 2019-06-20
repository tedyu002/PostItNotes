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
    let ret_notes: Array<PostItNoteUI> = notes as Array<any>;

    for (let note of notes) {
      let note_ui = note as PostItNoteUI;
      note_ui.selected = false;
    }

    return ret_notes as Array<PostItNoteUI>;
  }

  wrap(note: PostItNote): PostItNoteUI {
    let note_ui = note as PostItNoteUI;

    note_ui.selected = false;

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
  selected: boolean = false;
  isNew: boolean = false;
}
