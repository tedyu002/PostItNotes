import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PostItNote } from '../../post-it-note';
import { PostItNotesService } from '../../post-it-notes.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
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

  newNote(event: MouseEvent): void {
    let note = new PostItNote();

    note.left = event.clientX;
    note.top = event.clientY;

    this.postItNotesService.assignMaxZIndex(note);
    this.postItNotesService.insert(note);
  }

  dropping(event: DragEvent): void {
    event.preventDefault();
  }

  drop(event: DragEvent): void {
    let data = JSON.parse(event.dataTransfer.getData("text/plain"));

    for (let note of this.notes) {
      if (data.id == note.id) {
        note.left = note.left ? note.left: 0;
        note.top = note.top? note.top: 0;

        note.left += event.clientX - data.clientX;
        note.top += event.clientY - data.clientY;

        this.postItNotesService.update(note);

        break;
      }
    }
  }
}
