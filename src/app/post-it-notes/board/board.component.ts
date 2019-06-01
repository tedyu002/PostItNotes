import { Component, OnInit, Input } from '@angular/core';
import { PostItNote } from '../../post-it-note';
import { PostItNotesService } from '../../post-it-notes.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input('notes')
  notes: Array<PostItNote>;

  constructor(
    private postItNotesService: PostItNotesService
  ) { }

  ngOnInit() {
  }

  newNote(): void {
    let note = new PostItNote();

    this.postItNotesService.insert(note);
  }
}
