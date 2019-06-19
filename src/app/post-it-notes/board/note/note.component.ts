import { Subscription, fromEvent } from 'rxjs';
import { windowToggle, switchAll, tap, filter, map, takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { PostItNote } from '../../../post-it-note';
import { PostItNotesService } from '../../../post-it-notes.service';
import { PostItNotesUIService, PostItNoteUI } from '../../../post-it-notes-ui.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {
  @Input('note')
  _note: PostItNoteUI;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  noteForm: FormGroup = new FormGroup({
    title: new FormControl('', {updateOn: 'blur'}),
    color: new FormControl('', {updateOn: 'change'}),
    content: new FormControl('', {updateOn: 'blur'})
  });

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesUIService: PostItNotesUIService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.noteForm.get('title').setValue(this._note.title);
    this.noteForm.get('color').setValue(this._note.color);
    this.noteForm.get('content').setValue(this._note.content);

    this.noteForm.get('title').valueChanges.subscribe((title) => {
      this._note.title = title;
      this.postItNotesService.update(this._note);
    });
    this.noteForm.get('color').valueChanges.subscribe((color) => {
      this._note.color = color;
      this.postItNotesService.update(this._note);
    });
    this.noteForm.get('content').valueChanges.subscribe((content) => {
      this._note.content = content;
      this.postItNotesService.update(this._note);
    });

    this.subscriptions.push(
      this._note.changeEvent.subscribe(
        (note: PostItNote) => {
          this.changeDetectorRef.markForCheck();
        }
      )
    );
  }

  @ViewChild('noteFormDom', {static: true})
  noteFormDom: ElementRef;

  ngAfterViewInit() {
    let prevLocation: [number, number] = [0, 0];

    let downWithInit$ = fromEvent(this.noteFormDom.nativeElement, 'mousedown').pipe(
      filter(
        (ev: MouseEvent) => ['INPUT', 'TEXTAREA'].indexOf((ev.target as Element).tagName) == -1
      ),
      tap(
        (ev: MouseEvent) => {
          prevLocation = [ev.clientX, ev.clientY];
        }
      ),
      map((ev: MouseEvent) => {
        return this.postItNotesUIService.boardMovingEvent.pipe(
          takeUntil(fromEvent(this.noteFormDom.nativeElement, 'mouseup'))
        )
      }),
      switchAll()
    );

    this.subscriptions.push(
      downWithInit$.subscribe(
        (location: [number, number]) => {
          this._note.left += location[0] - prevLocation[0];
          this._note.top += location[1] - prevLocation[1];
          this.postItNotesService.update(this._note);
          prevLocation = location;
        }
      )
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get note(): PostItNote {
    return this._note;
  }

  toTop(): void {
    this.postItNotesService.assignMaxZIndex(this._note);
    this.postItNotesUIService.selectedNote = this._note;
    this.postItNotesService.update(this._note);
  }
}
