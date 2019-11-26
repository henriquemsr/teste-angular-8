import { Component, OnInit } from '@angular/core';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { ENDPOINT } from 'src/app/services/endpoints';
import { UserModel } from 'src/app/models/user.model';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ROUTERS } from 'src/app/services/routes';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';




@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userList = true;
  users: any;
  singleUser: UserModel;
  modalRef: BsModalRef;
  load = false;
  returnedArray: string[];
  fieldsDate =
    {
      server: 'YYYY-MM-DD',
      front: 'DD/MM/YYYY'
    };

  constructor(
    public service: UtilserviceService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listUsers();
  }

  selectOption(param: boolean) {
    if (param === true) {
      this.userList = true;
    } else {
      this.userList = false;
      this.editUser(-1);
    }


  }

  transformDate(date: any) {
    date = new Date();
    date = moment(date, this.fieldsDate.server).format(this.fieldsDate.front);
    console.log(date);

  }

  listUsers() {
    this.service.httpGet(ENDPOINT.USERS, null, false).subscribe(
      res => {
        this.users = res.body as UserModel;
        this.users.map(row => {
          row.data_front = moment(row.data_nascimento, this.fieldsDate.server).format(this.fieldsDate.front);;
          row.idade = this.calcYearsOld(row.data_nascimento);
        });
        this.returnedArray = this.users.slice(0, 4);
      },
      err => {
        console.log(err);
      }
    );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.users.slice(startItem, endItem);
  }

  openModalDelete(modalDelete, item: UserModel) {
    this.singleUser = item;
    console.log(item);
    this.modalRef = this.modalService.show(modalDelete);
  }

  editUser(item: any) {
    this.service.navigate(ROUTERS.user_form, { item });
  }

  deleteUser(item: UserModel) {
    this.load = true;
    console.log(item);
    this.service.httpDelete(`${ENDPOINT.USERS}/${item.id}`, null, false).subscribe(
      res => {
        console.log(res);
        this.load = false;
        this.toastr.success("Usuario foi deletado.", "", {
          timeOut: 2000,
          closeButton: false,
          positionClass: "toast-top-center",
          messageClass: 'title-toast-success',
          titleClass: 'title-toast-success',
          progressBar: true,
          progressAnimation: 'increasing'
        });
        this.listUsers();
        this.modalRef.hide();

      },
      err => {
        console.log(err);
        this.toastr.error(err.message, "", {
          timeOut: 2000,
          closeButton: false,
          positionClass: "toast-top-center",
          messageClass: 'title-toast-danger',
          titleClass: 'title-toast-danger',
          progressBar: true,
          progressAnimation: 'increasing'
        });
        this.load = false;
      }
    );
  }

  calcYearsOld(date) {
    var date1 = new Date();
    var date2 = new Date(date);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var diffYears = Math.ceil(diffDays / 365);
    return diffYears;
  }

}
