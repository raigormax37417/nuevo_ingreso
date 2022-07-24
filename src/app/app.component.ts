import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { customLengthValidator } from './validators/customvalidator.validator';
import { FirebaseService } from './services/firebase.service';
import { Alumno, User } from './interfaces';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';
import { getDocs } from 'firebase/firestore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'nuevo-ingreso';
  isValid: boolean = false;
  nivel: string[] = [];
  private Alumno: Alumno[] = [];
  private User!: User;
  private path: string = "nuevo_ingreso/";
  @ViewChild('success') success!: ElementRef;
  @ViewChild('warning') warnign!: ElementRef;

  nivel_academico = {
    "licenciatura": [
      "Enfermería",
      "Software",
      "Arquitectura"
    ],
    "maestria": [
      "Fiscal",
      "Educación"
    ],
    "doctorado": [
      "Comunicación",
      "Gastronomía"
    ]
  }

  formData!: FormGroup;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  
  constructor(private fb: FormBuilder, private fire: FirebaseService, private authService: AuthService) {}
  ngOnInit(): void {
    this.formData = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      semestre: [null, [Validators.required, customLengthValidator(1,1)]],
      matricula: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.numberRegEx)]],
      nivel_academico: [null, Validators.required],
      especialidad: ["", Validators.required]
    })
  }

  get alumno(): { [key: string]: AbstractControl;} {return this.formData.controls;}

  nivelSelect(value: string) {
    let values = Object.values(this.nivel_academico);
    let keys = Object.keys(this.nivel_academico);
    keys.forEach( (resp, index) => {
      if(resp === value) {
        this.nivel = values[index];
      }
    })   
  }
  private generateRandomPassword(): string {
    let result: string = ""
    return result = Math.random().toString(36).slice(2) +
    Math.random().toString(36).toUpperCase().slice(2); 
  }
  async saveData() {
    this.isValid = true;
    if(this.formData.invalid) {return}
    console.log(this.formData.value);

    const id = this.fire.getID();
    this.Alumno = this.formData.value;
    let user = {
      email: this.formData.value.email,
      password: this.generateRandomPassword()
    }
    console.log(user);
    const q = this.fire.getDataIsUnic<Alumno>(this.path, 'email', this.formData.value.email)
    const querySnapshot = await getDocs(q)
    .then( resp => {
      if(resp.size > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: `El alumno ya se encuentra registrado!`,
        });
      } else {
        this.fire.createDoc(this.Alumno, this.path, id)
        .then(resp => {
          let loged = this.authService.login(user)
          Swal.fire({
            icon: 'success',
            title: 'Registrado con éxito',
            text: 'Se ha registrado el alumno correctamente'
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: `A ocurrido un error al registrarse !${error}`,
          });
        })
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: `A ocurrido un error !${error}`,
      });
    })
  } 
}
