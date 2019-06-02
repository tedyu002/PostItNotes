import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { PostItNote } from '../post-it-note';
import { PostItNotesService } from '../post-it-notes.service';

@Component({
  selector: 'app-post-it-notes',
  templateUrl: './post-it-notes.component.html',
  styleUrls: ['./post-it-notes.component.css']
})
export class PostItNotesComponent implements OnInit {
  notes: Array<PostItNote>;

  itemChange: Subscription;
  itemDelete: Subscription;

  constructor(
    private postItNotesService: PostItNotesService
  ) { }

  ngOnInit() {
    this.renew();

    this.itemChange = this.postItNotesService.itemChangeEvent.subscribe(
      () => {
        this.renew();
      }
    );

    this.itemDelete = this.postItNotesService.itemDeleteEvent.subscribe(
      () => {
        this.renew();
      }
    );
  }

  ngOnDestroy() {
    this.itemChange.unsubscribe();
    this.itemDelete.unsubscribe();
  }

  private renew() {
    this.notes = this.postItNotesService.list();
  }

}
