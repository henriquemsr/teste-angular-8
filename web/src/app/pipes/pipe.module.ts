import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataptbrPipe } from "./datapipe/datapipe.pipe";
import { CpfCnpjPipe } from './cpfcnpj/cpfcnpj.pipe';
import { SearchPipe } from './search/search.pipe';

@NgModule({
  declarations: [DataptbrPipe, CpfCnpjPipe, SearchPipe],
  imports: [CommonModule],
  exports: [DataptbrPipe, CpfCnpjPipe, SearchPipe]
})
export class PipeModule { }
