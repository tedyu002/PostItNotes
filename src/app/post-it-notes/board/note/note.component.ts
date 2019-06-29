import { Subscription, fromEvent} from 'rxjs';
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

  constructor(
    private postItNotesService: PostItNotesService,
    private postItNotesUIService: PostItNotesUIService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this._note.isEditing) {
      this.startEdit();
    }
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
          this._note.note.left += location[0] - prevLocation[0];
          this._note.note.top += location[1] - prevLocation[1];

          this._note.shadowNote.left = this._note.note.left;
          this._note.shadowNote.top = this._note.note.top;

          this.postItNotesService.update(this._note.note);
          this._note.emit();
          prevLocation = location;
        }
      )
    );

    if (this._note.isEditing) {
      this.titleInput.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get note(): PostItNote {
    if (this.isEditing) {
      return this._note.shadowNote;
    }
    else {
      return this._note.note;
    }
  }

  get isEditing(): boolean {
    return this._note.isEditing;
  }

  get color(): string {
    if (this.isEditing) {
      return this._note.shadowNote.color;
    }
    else {
      return this._note.note.color;
    }
  }

  toTop(): void {
    this.postItNotesService.assignMaxZIndex(this._note.note);
    this._note.shadowNote.zindex = this._note.note.zindex;
    this.postItNotesUIService.selectedNote = this._note;
    this.postItNotesService.update(this._note.note);
    this._note.emit();
  }

  save(): void {
    this._note.commitShadow();

    this.postItNotesService.update(this._note.note);
    this._note.isEditing = false;
    this._note.emit();
  }

  onKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      this.save();
    } else if (event.key === 'Escape') {
      this._note.makeShadow();
      this._note.emit();
    }
  }

  onContentInput() {
    let ele = this.contentInput.nativeElement;

    ele.style.height = "";
    ele.style.height = ele.scrollHeight + 'px';
  }

  startEdit() {
    this._note.makeShadow();
    this._note.isEditing = true;
    this._note.emit();

    setTimeout(
      () => {
        this.onContentInput();
        this.contentInput.nativeElement.focus();
      },
    1);
  }

  modelChange(): void {
    this._note.emit();
  }
}
