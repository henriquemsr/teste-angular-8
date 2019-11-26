import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologiesRoutingModule } from './technologies-routing.module';
import { TechnologiesComponent } from './technologies.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TechnologiesComponent],
  imports: [
    CommonModule,
    TechnologiesRoutingModule,
    PipeModule,
    FormsModule,
    ComponentsModule
  ]
})
export class TechnologiesModule { }
