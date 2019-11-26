import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "datapipe"
})
export class DataptbrPipe implements PipeTransform {
  transform(value: any, format = "DD/MM/YYYY", args?: any): any {
    if (value) {
      return moment(value).format(format);
    } else {
      return "-";
    }
  }
}
