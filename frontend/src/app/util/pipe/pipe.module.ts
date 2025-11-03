import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlerteFormatterPipe } from './alerte/alerte-formatter.pipe';
import { TextFormatterPipe } from './text/text-formatter.pipe';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { ThousandsSeparatorPipe } from './text/number-formatter.pipe';
import { TimeAgoPipe } from './timeAgo/time-ago.pipe';



@NgModule({
  declarations: [
    AlerteFormatterPipe,
    TextFormatterPipe,
    SafeUrlPipe,
    ThousandsSeparatorPipe,
    TimeAgoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlerteFormatterPipe,
    TextFormatterPipe,
    SafeUrlPipe,
    ThousandsSeparatorPipe,
    TimeAgoPipe
  ]
})
export class PipeModule { }
