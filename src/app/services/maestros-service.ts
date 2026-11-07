import { inject, Injectable } from '@angular/core';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosMaestro } from '../interfaces/usuarios.interfaces';

@Injectable({ providedIn: 'root' })
export class MaestrosService {
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  public esquemaMaestro(): DatosMaestro {
    return {
      rol: '',
      id_trabajador: null as unknown as number,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      telefono: '',
      rfc: '',
      cubiculo: '',
      area_investigacion: '',
      materias_json: [],
    };
  }

  public validarMaestro(data: DatosMaestro, editar: boolean) {
    const error: any = {};

    if (!this.validatorService.required(data.id_trabajador)) {
      error['id_trabajador'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data.id_trabajador)) {
      error['id_trabajador'] = this.errorService.numeric;
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

    if (!this.validatorService.required(data.telefono)) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.rfc)) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data.rfc, 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data.rfc, 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data.cubiculo)) {
      error['cubiculo'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.area_investigacion)) {
      error['area_investigacion'] = this.errorService.required;
    }

    if (!data.materias_json || data.materias_json.length === 0) {
      error['materias_json'] = 'Debes seleccionar al menos una materia';
    }

    return error;
  }
}