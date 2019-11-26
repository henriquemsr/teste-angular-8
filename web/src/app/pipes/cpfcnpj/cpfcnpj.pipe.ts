import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "cpfcnpj"
})
export class CpfCnpjPipe implements PipeTransform {
  transform(value: any, format = "DD/MM/YYYY", args?: any): any {
    if (value) {
      if (value.length === 11) {
        //000.000.000-00
        return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' +
          value.substring(6, 9) + '-' + value.substring(9, 11);
      } else {
        // 00.000.000/0000-00
        return value.substring(0, 2) + '.' + value.substring(2, 5) + '.' +
          value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12, 14);
      }
    } else {
      return '-';
    }
  }
}
