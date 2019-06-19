import { Injectable, EventEmitter } from '@angular/core';
import { PostItNote } from './post-it-note';

@Injectable({
  providedIn: 'root'
})
export class PostItNotesUIService {
  boardMovingEvent: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

  constructor() {
  }

  wrapArray(notes: Array<PostItNote>): Array<PostItNoteUI> {
    let ret_notes: Array<PostItNoteUI> = notes as Array<any>;

    for (let note of notes) {
      let note_ui = note as PostItNoteUI;
      note_ui.is_selected = false;
    }

    return ret_notes as Array<PostItNoteUI>;
  }

  wrap(note: PostItNote): PostItNoteUI {
    let note_ui = note as PostItNoteUI;

    note_ui.is_selected = false;

    return note_ui;
  }
}

export class PostItNoteUI extends PostItNote {
  is_selected: boolean = false;
}
