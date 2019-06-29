import { BehaviorSubject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { PostItNote } from './post-it-note';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesUIService {
  boardMovingEvent: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();
  notes: Array<PostItNoteUI>;

  _selectedNote: PostItNoteUI;

  constructor() {
  }

  wrapArray(notes: Array<PostItNote>): Array<PostItNoteUI> {
    let ret_notes: Array<PostItNoteUI> = new Array<PostItNoteUI>()

    for (let note of notes) {
      ret_notes.push(this.wrap(note));
    }

    this.notes = ret_notes;

    return ret_notes as Array<PostItNoteUI>;
  }

  wrap(note: PostItNote): PostItNoteUI {
    let note_ui = new PostItNoteUI();

    note_ui.note = note;
    note_ui.shadowNote = Object.assign({}, note_ui) as PostItNoteUI;

    return note_ui;
  }


  del(note: PostItNoteUI) : void {
    let index = this.notes.findIndex(
      (ele) => {
        return ele.note.id === note.note.id;
      }
    );
    this.notes.splice(index, 1);
  }

  set selectedNote(note: PostItNoteUI) {
    if (this._selectedNote) {
      this._selectedNote.selected = false;
      this._selectedNote.emit();
    }

    this._selectedNote = note;
    this._selectedNote.selected = true;
    this._selectedNote.emit();
  }
}

export class PostItNoteUI extends PostItNote {
  note: PostItNote;
  shadowNote: PostItNote;

  changeEvent$: BehaviorSubject<PostItNoteUI> = new BehaviorSubject<PostItNoteUI>(this);

  selected: boolean = false;
  isEditing: boolean = false;

  makeShadow() {
    Object.assign(this.shadowNote, this.note);
  }

  commitShadow() {
    Object.assign(this.note, this.shadowNote);
  }

  emit(): void {
    this.changeEvent$.next(Object.assign(new PostItNoteUI(), this));
  }
}
