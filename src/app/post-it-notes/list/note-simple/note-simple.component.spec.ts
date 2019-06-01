import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSimpleComponent } from './note-simple.component';

describe('NoteSimpleComponent', () => {
  let component: NoteSimpleComponent;
  let fixture: ComponentFixture<NoteSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
