import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask/mask.directive';

@NgModule({
  declarations: [MaskDirective],
  imports: [
    CommonModule
  ],
  exports: [MaskDirective]
})
export class DirectivesModule { }
