import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UsuarioModel } from "../../models/usuario.model";

import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel;
  recordarme = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      // si el formulario es invalido osea q no cumple con lo requerido en el html no me hace los consolelogs
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      text: "espere por favor",
      icon: "info",
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(
      (resp) => {
        console.log(resp);
        Swal.close();
        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        } else {
        }
        this.router.navigateByUrl("/home");

        // llamamos el metodo nuevoUsuario del service, le mandamos como parametro el usuario de tipo UsuarioModel, nos suscribimos a los cambios
        // < y mediante resp interactuamos con la respuesta q nos da firebase, con el token y todo eso
      },
      (err) => {
        console.log(err.error.error.message);
        Swal.fire({
          text: err.error.error.message,
          title: "error al autenticar",
          icon: "error",
        });
      }
    );
  }
}
