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
  isEditing: Boolean;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  noteForm: FormGroup = new FormGroup({
    title: new FormControl('', {updateOn: 'change'}),
    color: new FormControl('', {updateOn: 'change'}),
    content: new FormControl('', {updateOn: 'change'})
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
    this.isEditing = this._note.isNew;
    delete this._note.isNew;

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

  @ViewChild('titleInput', {static: false})
  titleInput: ElementRef;

  @ViewChild('contentInput', {static: false})
  contentInput: ElementRef;

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

    if (this._note.isNew) {
      this.titleInput.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get note(): PostItNote {
    return this._note;
  }

  get color(): string {
    if (this.isEditing) {
      return this.noteForm.get('color').value;
    }
    else {
      return this._note.color;
    }
  }

  get content(): string {
    if (this.isEditing) {
      return this.noteForm.get('content').value;
    }
    else {
      return this._note.content;
    }
  }

  toTop(): void {
    this.postItNotesService.assignMaxZIndex(this._note);
    this.postItNotesUIService.selectedNote = this._note;
    this.postItNotesService.update(this._note);
  }

  onKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      this._note.title = this.noteForm.get('title').value;
      this._note.color = this.noteForm.get('color').value;
      this._note.content = this.noteForm.get('content').value;

      this.postItNotesService.update(this._note);
      this.isEditing = false;
    } else if (event.key === 'Escape') {
      this.noteForm.get('title').setValue(this._note.title);
      this.noteForm.get('color').setValue(this._note.color);
      this.noteForm.get('content').setValue(this._note.content);
    }

    setTimeout(() => {
        this.changeDetectorRef.markForCheck();
    }, 1);
  }

  startEdit() {
    this.isEditing = true;
    setTimeout(() => {
      this.contentInput.nativeElement.focus();
      this.changeDetectorRef.markForCheck();
    }, 1);
  }
}
