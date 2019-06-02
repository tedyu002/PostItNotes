import { Component, OnInit, Input } from '@angular/core';
import { PostItNote } from '../../post-it-note';

import { PostItNotesService } from '../../post-it-notes.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  notes: Array<PostItNote>;

  constructor(
    private postItNotesService: PostItNotesService
  ) { }

  ngOnInit() {
    this.notes = this.postItNotesService.list();
  }
}
