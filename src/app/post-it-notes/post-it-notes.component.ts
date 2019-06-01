import { Component, OnInit } from '@angular/core';
import { PostItNote } from '../post-it-note';
import { PostItNotesService } from '../post-it-notes.service';

@Component({
  selector: 'app-post-it-notes',
  templateUrl: './post-it-notes.component.html',
  styleUrls: ['./post-it-notes.component.css']
})
export class PostItNotesComponent implements OnInit {
  notes: Array<PostItNote>;

  constructor(
    private postItNotesService: PostItNotesService
  ) { }

  ngOnInit() {
    this.notes = this.postItNotesService.list();
  }

}
