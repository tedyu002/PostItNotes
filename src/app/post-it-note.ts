import { EventEmitter } from '@angular/core';

export class PostItNote {
  id: string = "";
  color: string = "";
  title: string = "";
  content: string = "";
  left: number = 0;
  top: number = 0;
  zindex: number = 0;
  textHeight: number = 0;

  changeEvent: EventEmitter<PostItNote>;
}
