import { Component, OnInit } from '@angular/core';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { ENDPOINT } from 'src/app/services/endpoints';
import { TechModel } from 'src/app/models/tech.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss']
})
export class TechnologiesComponent implements OnInit {
  load = false;
  technologies: TechModel;
  constructor(
    public service: UtilserviceService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listTechs();
  }

  listTechs() {
    this.service.httpGet(ENDPOINT.TECH, null, false).subscribe(
      res => {
        this.technologies = res.body as TechModel;
      },
      err => {
        console.log(err);
      }
    );
  }

  touch() {
    this.toastr.error("Sem permissão para alterar!", "", {
      timeOut: 2000,
      closeButton: false,
      positionClass: "toast-top-center",
      messageClass: 'title-toast-danger',
      titleClass: 'title-toast-danger',
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  closeX = false;
  typing: string = "";
  closeSearch() {
    this.closeX = false;
    this.typing = "";
  }
  typingInput() {
    this.typing !== "" ? this.closeX = true : this.closeX = false;
  }

}
