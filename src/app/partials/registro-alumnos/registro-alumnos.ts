import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AlumnosService } from '../../services/alumnos-service';
//Importar la interfaz de datos del alumno
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosAlumno = {} as DatosAlumno;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de alumnos para validar y registrar los datos del alumno
  private alumnosService = inject(AlumnosService);

  //Declarar las variables para el formulario de registro
  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Variables para los campos de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor() { }

  ngOnInit(): void {
    //Se inicializa el objeto alumno con el esquema vacío
    this.alumno = this.alumnosService.esquemaAlumno();
    this.alumno.rol = this.rol;
    console.log('Datos del alumno:', this.alumno);
  }

  public regresar(): void {
    this.location.back();
  }

  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar() {
    // Validar los datos del formulario con el servicio
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Los inputs con máscara entregan texto, aquí los convertimos a number
    this.alumno.matricula = Number(this.alumno.matricula);
    this.alumno.edad = Number(this.alumno.edad);

    // TODO: Aquí se debe implementar la lógica para registrar los datos del alumno en el backend.
    console.log('Alumno válido:', this.alumno);
  }

  public actualizar() {

  }

  //Evita que se escriban caracteres que no sean letras o espacios
  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}