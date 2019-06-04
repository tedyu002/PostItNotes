import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PostItNote } from '../../post-it-note';

import { PostItNotesService } from '../../post-it-notes.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  notes: Array<PostItNote>;

  constructor(
    private postItNotesService: PostItNotesService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.notes = this.postItNotesService.list();

    this.postItNotesService.itemChangeEvent.subscribe(
      () => {
        this.changeDetector.markForCheck();
      }
    );
  }
}
