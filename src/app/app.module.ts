import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PostItNotesComponent } from './post-it-notes/post-it-notes.component';
import { BoardComponent } from './post-it-notes/board/board.component';
import { NoteComponent } from './post-it-notes/board/note/note.component';
import { NoteSimpleComponent } from './post-it-notes/list/note-simple/note-simple.component';
import { ListComponent } from './post-it-notes/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    PostItNotesComponent,
    BoardComponent,
    NoteComponent,
    NoteSimpleComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
