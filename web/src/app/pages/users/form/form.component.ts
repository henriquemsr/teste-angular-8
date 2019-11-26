import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ENDPOINT } from 'src/app/services/endpoints';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { UserModel } from 'src/app/models/user.model';
import { Location } from '@angular/common';
import { TechModel } from 'src/app/models/tech.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  load = false;
  formUser: FormGroup;
  registerUser = false;
  technologies: TechModel;
  userId: number;
  active = false;
  formSend = false;
  fieldsDate =
    {
      server: 'YYYY-MM-DD',
      front: 'DD/MM/YYYY'
    };
  constructor(
    private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    public service: UtilserviceService,
    private _goBack: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.createFomrUser();
    this.ActivatedRoute.params.subscribe(params => {
      if (params.item > 0) {
        this.getUser(params.item);
        this.registerUser = false;
        this.userId = params.item;
      } else {
        this.registerUser = true;
        this.listTechnologies();
      }
    });
  }

  createFomrUser() {
    this.formUser = this.formBuilder.group({
      nome: [null, [Validators.required]],
      sobrenome: [null, [Validators.required]],
      data_nascimento: [null, [Validators.required]],
      linguagem_favorita: [null],
      obs: [null,],
      idade: [null]
    });
  }

  backPage() {
    this._goBack.back();
  }

  calcYearsOld(date) {
    var date1 = new Date();
    var date2 = new Date(date);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var diffYears = Math.ceil(diffDays / 365);
    return Number(diffYears);
  }

  getUser(id) {
    this.service.httpGet(`${ENDPOINT.USERS}/${id}`, null, false).subscribe(
      res => {
        let userData = res.body as UserModel;
        let dtnasc = userData.data_nascimento;
        let dateFront;
        dateFront = moment(dtnasc, this.fieldsDate.server).format(this.fieldsDate.front);
        this.formUser.get("nome").setValue(userData.nome);
        this.formUser.get("sobrenome").setValue(userData.sobrenome);
        this.formUser.get("data_nascimento").setValue(dateFront);
        this.formUser.get("linguagem_favorita").setValue(userData.linguagem_favorita);
        this.formUser.get("obs").setValue(userData.obs);
        this.active = userData.active;
        this.formUser.get("idade").setValue(userData.idade);
        this.formUser.get("idade").disable();
        this.listTechnologies();
      },
      err => {
        console.log(err);
      }
    );
  }

  changeActive() {
    this.active === false ? this.active = true : this.active = false;
  }

  listTechnologies() {
    this.service.httpGet(ENDPOINT.TECH, null, false).subscribe(
      res => {
        this.technologies = res.body as TechModel;
      },
      err => {
        console.log(err);
      }
    );
  }

  updateData(id: number) {
    this.formSend = true;
    this.load = true;

    if (this.formUser.invalid) {
      //valida formulário
      this.formUser.get("nome").invalid;
      this.formUser.get("sobrenome").invalid;
      this.formUser.get("data_nascimento").invalid;

      //mensagem validação
      this.toastr.error("Por favor, verifique os campos em destaque", "", {
        timeOut: 2000,
        closeButton: false,
        positionClass: "toast-top-center",
        messageClass: 'title-toast-danger',
        titleClass: 'title-toast-danger',
        progressBar: true,
        progressAnimation: 'increasing'
      });
      this.load = false;
    } else {
      //salva formulário
      let dtnasc = this.formUser.get("data_nascimento").value;
      let dateToServer;
      dateToServer = moment(dtnasc, this.fieldsDate.front).format(this.fieldsDate.server);
      let age = this.calcYearsOld(dateToServer);
      let objSave = {
        nome: this.formUser.get("nome").value,
        sobrenome: this.formUser.get("sobrenome").value,
        data_nascimento: dateToServer,
        linguagem_favorita: this.formUser.get("linguagem_favorita").value,
        obs: this.formUser.get("obs").value,
        active: this.active,
        idade: age
      };

      this.service.httpPut(`${ENDPOINT.USERS}/${id}`, objSave, false).subscribe(
        () => {
          this.load = false;
          this.toastr.success("Usuario alterado com sucesso!", "", {
            timeOut: 2000,
            closeButton: false,
            positionClass: "toast-top-center",
            messageClass: 'title-toast-success',
            titleClass: 'title-toast-success',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getUser(this.userId);
          this.load = false;
          this.formSend = false;
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
  }

  saveData(id: number) {
    this.formSend = true;
    this.load = true;


    if (this.formUser.invalid) {
      //valida formulário
      this.formUser.get("nome").invalid;
      this.formUser.get("sobrenome").invalid;
      this.formUser.get("data_nascimento").invalid;
      this.formUser.get("linguagem_favorita").invalid;
      //mensagem validação
      this.toastr.error("Por favor, verifique os campos em destaque", "", {
        timeOut: 2000,
        closeButton: false,
        positionClass: "toast-top-center",
        messageClass: 'title-toast-danger',
        titleClass: 'title-toast-danger',
        progressBar: true,
        progressAnimation: 'increasing'
      });
      this.load = false;
    } else {
      //salva formulário
      let dtnasc = this.formUser.get("data_nascimento").value;
      let dateToServer;
      dateToServer = moment(dtnasc, this.fieldsDate.front).format(this.fieldsDate.server);
      dateToServer = moment(dtnasc, this.fieldsDate.front).format(this.fieldsDate.server);
      let age = this.calcYearsOld(dateToServer);
      let objSave = {
        nome: this.formUser.get("nome").value,
        sobrenome: this.formUser.get("sobrenome").value,
        data_nascimento: dateToServer,
        linguagem_favorita: this.formUser.get("linguagem_favorita").value,
        active: true,
        obs: this.formUser.get("obs").value,
        idade: age
      };

      this.service.httpPost(ENDPOINT.USERS, objSave, false).subscribe(
        res => {
          console.log(res);
          this.load = false;
          this.toastr.success("Usuario registrado com sucesso!", "", {
            timeOut: 2000,
            closeButton: false,
            positionClass: "toast-top-center",
            messageClass: 'title-toast-success',
            titleClass: 'title-toast-success',
            // toastClass:'bg-tertiary',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          let userN = res.body as UserModel;
          this.getUser(userN.id)
          this.load = false;
          this.formSend = false;
          this.registerUser = false;
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
            this.formSend = false;
          }
        }
      );
    }
  }

}
