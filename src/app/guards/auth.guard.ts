import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // ponemos boolean pq vamos a evaluar q estaAutenticado retorne un valor, en ese caso es verdadero
    if (this.auth.estaAutenticado()) {
      return true;
      // si retornamos true podemos ir a esa ruta, en caso contrario me redirecciona a login
    } else {
      this.router.navigateByUrl("/login");
      return false;
    }
  }
}
