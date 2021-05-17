import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // isAuthenticated : boolean;
  loginForm : FormGroup

  constructor(public router : Router, public auth_service : AuthService) { }

  ngOnInit(): void {
    {
      this.loginForm = new FormGroup ({
        'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
        'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]})
      })
  }
  }

  onLogin(){
    if(this.loginForm.invalid){
      return;
    }
  //  if(this.loginForm.value.email === 'admin123@gmail.com' && this.loginForm.value.password=== 'admin123'){
  //     // this.isAuthenticated = true
  //    this.router.navigate(['/vote'])
  //  }
    this.auth_service.login(this.loginForm.value.email , this.loginForm.value.password)
  //this.loginForm.reset();
    this.router.navigate(['/vote'])

  }
}
