import { Subscription, fromEvent } from 'rxjs';
import { windowToggle, switchAll, tap, filter } from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { PostItNote } from '../../../post-it-note';
import { PostItNotesService } from '../../../post-it-notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {
  @Input('note')
  _note: PostItNote;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  noteForm: FormGroup = new FormGroup({
    title: new FormControl('', {updateOn: 'blur'}),
    color: new FormControl('', {updateOn: 'blur'}),
    content: new FormControl('', {updateOn: 'blur'})
  });

  constructor(
    private postItNotesService: PostItNotesService,
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
      this.postItNotesService.itemChangeEvent.subscribe(
        (note: PostItNote) => {
          if (this._note === note) {
            this.changeDetectorRef.markForCheck();
          }
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
        (ev: MouseEvent) => {
          let element: Element = ev.target as Element;

          for (let forbidden of ['INPUT', 'TEXTAREA']) {
            if (element.tagName == forbidden) {
              return false;
            }
          }

          return true;
        }
      ),
      tap(
        (ev: MouseEvent) => {
          prevLocation = [ev.clientX, ev.clientY];
        }
      )
    );

    let movingByDownUp = this.postItNotesService.boardMovingEvent.pipe(
      windowToggle(downWithInit$, (ev: MouseEvent) => {
        return fromEvent(ev.target, 'mouseup');
      }),
      switchAll()
    );

    this.subscriptions.push(
      movingByDownUp.subscribe(
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
    this.postItNotesService.update(this._note);
  }
}
