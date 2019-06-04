import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { PostItNote } from '../../../post-it-note';

@Component({
  selector: 'app-note-simple',
  templateUrl: './note-simple.component.html',
  styleUrls: ['./note-simple.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteSimpleComponent implements OnInit {

  @Input('note')
  note: PostItNote;

  constructor() { }

  ngOnInit() {
  }

  get title(): string {
    return this.note.title;
  }
}
