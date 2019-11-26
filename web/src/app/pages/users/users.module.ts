import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UsersComponent } from './users.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  declarations: [UsersComponent, FormComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    DirectivesModule,
    ComponentsModule
  ]
})
export class UsersModule { }
