import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MaestrosService } from '../../services/maestros-service';
//Importar la interfaz de datos del maestro
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-maestros',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de maestros para validar y registrar los datos del maestro
  private maestrosService = inject(MaestrosService);

  //Declarar las variables para el formulario de registro
  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Variables para los campos de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  //Opciones del select de área de investigación
  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programación' },
    { value: '3', viewValue: 'Bases de datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matemáticas' },
  ];

  //Opciones de los checkboxes de materias
  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programación 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologías Web' },
    { value: '5', nombre: 'Minería de datos' },
    { value: '6', nombre: 'Desarrollo móvil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administración de redes' },
    { value: '9', nombre: 'Ingeniería de Software' },
    { value: '10', nombre: 'Administración de S.O.' },
  ];

  constructor() { }

  ngOnInit(): void {
    //Se inicializa el objeto maestro con el esquema vacío
    this.maestro = this.maestrosService.esquemaMaestro();
    this.maestro.rol = this.rol;
    console.log('Datos del maestro:', this.maestro);
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

  //Agrega o quita la materia de la lista según el checkbox marcado
  public checkboxChange(event: any) {
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value);
    } else {
      this.maestro.materias_json = this.maestro.materias_json.filter(
        (materia: string) => materia !== event.source.value
      );
    }
    console.log('Materias seleccionadas:', this.maestro.materias_json);
  }

  //Indica si una materia ya está seleccionada (útil al editar)
  public revisarSeleccion(nombre: string): boolean {
    return this.maestro.materias_json?.includes(nombre);
  }

  public registrar() {
    // Validar los datos del formulario con el servicio
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Los inputs con máscara entregan texto, aquí lo convertimos a number
    this.maestro.id_trabajador = Number(this.maestro.id_trabajador);

    // TODO: Aquí se debe implementar la lógica para registrar los datos del maestro en el backend.
    console.log('Maestro válido:', this.maestro);
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