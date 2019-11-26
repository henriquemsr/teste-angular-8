import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ENDPOINT } from 'src/app/services/endpoints';
import { UtilserviceService } from 'src/app/services/utilservice.service';
import { ToastrService } from "ngx-toastr";
import { LoginModel } from 'src/app/models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formUser: FormGroup;
  load = false;
  constructor(
    private formBuilder: FormBuilder,
    public service: UtilserviceService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.createFomrSearch();
  }

  createFomrSearch() {
    this.formUser = this.formBuilder.group({
      email: ['henriquemendes25@gmail.com', [Validators.required, Validators.email]],
      password: ['12151311#', [Validators.required, Validators.minLength(6)]],
    });
  }

  logar() {
    this.load = true;
    let objLogin = {
      email: this.formUser.get("email").value,
      password: this.formUser.get("password").value,

    }
    this.service.httpPost(ENDPOINT.LOGIN, objLogin, false).subscribe(
      res => {
        //verificar dados de autenticação
        if (res.body['error'] === true) {
          this.toastr.error("", res.body['data'], {
            timeOut: 1500,
            closeButton: false,
            positionClass: "toast-top-center",
            messageClass: 'title-toast-success',
            titleClass: 'title-toast-success',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.load = false;

        } else {
          this.service.user = res.body as LoginModel;
          this.service.setStorage("user", this.service.user);

          setTimeout(() => {
            this.toastr.success("Logado com sucesso!", "", {
              timeOut: 1500,
              closeButton: false,
              positionClass: "toast-top-center",
              messageClass: 'title-toast-success',
              titleClass: 'title-toast-success',
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.service.navigate('users', null);
            this.load = false;
          }, 1000)
        }
      },
      err => {
        console.log(err);
        this.toastr.warning(err.message, "", {
          timeOut: 3000,
          closeButton: false,
          positionClass: "toast-top-center",
          messageClass: 'tertiary',
          titleClass: 'tertiary',
          progressBar: true,
          progressAnimation: 'increasing'
        });
        this.load = false;
      }
    );
  }

}
