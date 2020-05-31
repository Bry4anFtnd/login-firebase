import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioModel } from "../models/usuario.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts";
  private apiKey = "AIzaSyCuj1PvnU1iJH6mhDoWTaT6yDigKbrRIx4";
  userToken: string;

  // crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
    // asi llamamos este metodo cada q se inicie el servicio para q leamos el token de inmediato
  }

  logout() {
    localStorage.removeItem("token");
  }

  login(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}:signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
    // con este pipe lo q pretendemos es no ir hasta cada componente y traer la respuesta de furebase en este caso, con el pipe y el map tenemos una repuesta
    // y asi podemos almaenas el idToken q es el q nos dan cuando accdemos o creamos una cuenta para mantenernos activos con el usaurio
  }

  nuevoUsuario(usuario: UsuarioModel) {
    // segun la documentacion de firebase debo de mandar estos 3 campos para la creacion de usuario
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}:signUp?key=${this.apiKey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
    // en las peticiones post hay q mandar 3 argumentos, en este caso la url, el cuerpo q teien el apikey y la data q es authData
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);
    // metodo para guardar el token en el local storage
    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      // si en el local sotorage hay un token me lo asigna a usertoken
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
    // metodo para obtener el token almacenado del local storage
    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();

    expiraDate.setTime(expira);
    // metodo para poder saber trabajar con el guard, y es q si hay auna autenticacion es pq el userToken ya tiene datos
    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
