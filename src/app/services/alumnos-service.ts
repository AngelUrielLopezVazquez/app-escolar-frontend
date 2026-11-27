import { inject, Injectable } from '@angular/core';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosAlumno } from '../interfaces/usuarios.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlumnosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Headers de la petición: si hay sesión iniciada se envía el token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Petición POST para registrar un alumno en el backend
  public registrarAlumno(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/alumnos/`, data, { headers: this.getAuthHeaders() });
  }

  public esquemaAlumno(): DatosAlumno {
    return {
      rol: '',
      matricula: null as unknown as number,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      curp: '',
      rfc: '',
      edad: null as unknown as number,
      telefono: '',
      ocupacion: '',
    };
  }

  public validarAlumno(data: DatosAlumno, editar: boolean) {
    const error: any = {};

    if (!this.validatorService.required(data.matricula)) {
      error['matricula'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data.matricula)) {
      error['matricula'] = this.errorService.numeric;
    }

    if (!this.validatorService.required(data.first_name)) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.last_name)) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.email)) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data.email, 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data.email)) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data.password)) {
        error['password'] = this.errorService.required;
      }
      if (!this.validatorService.required(data.confirmar_password)) {
        error['confirmar_password'] = this.errorService.required;
      } else if (data.password !== data.confirmar_password) {
        error['confirmar_password'] = 'Las contraseñas no coinciden';
      }
    }

    if (!this.validatorService.required(data.fecha_nacimiento)) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.curp)) {
      error['curp'] = this.errorService.required;
    } else if (!this.validatorService.min(data.curp, 18)) {
      error['curp'] = this.errorService.min(18);
    } else if (!this.validatorService.max(data.curp, 18)) {
      error['curp'] = this.errorService.max(18);
    }

    if (!this.validatorService.required(data.rfc)) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data.rfc, 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data.rfc, 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data.edad)) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data.edad)) {
      error['edad'] = this.errorService.numeric;
    } else if (data.edad < 18) {
      error['edad'] = 'La edad debe ser mayor o igual a 18';
    }

    if (!this.validatorService.required(data.telefono)) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.ocupacion)) {
      error['ocupacion'] = this.errorService.required;
    }

    return error;
  }
}