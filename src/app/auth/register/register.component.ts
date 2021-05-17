import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signUpForm : FormGroup

  constructor(public auth_service : AuthService, public router : Router) { }

  ngOnInit(): void {
    {
      this.signUpForm = new FormGroup ({
        // 'name': new FormControl(null, {validators:[Validators.required, Validators.minLength(4)]}),
        'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
        // 'aadhar': new FormControl(null, {validators: [Validators.required]}),
        'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]})
      })
  }
  }

  onSignUp(){
    if(this.signUpForm.invalid){
      return;
    }
    this.auth_service.createUser( this.signUpForm.value.email, this.signUpForm.value.password)
    console.log(this.signUpForm.value)
    this.router.navigate([''])
  }

}
