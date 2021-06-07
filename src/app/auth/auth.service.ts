import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;

  private tokenTimer : any;
  private userId : string;
  private authStatusListener = new Subject<boolean>();

  constructor( private http: HttpClient, private router : Router) { }

  getToken(){
    return this.token;
  }


  getIsAuth(){
    return this.isAuthenticated;
  }

  getuserId(){
    return this.userId
  }

  //emit only in the server and to subscribe in header
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser( email:string, password : string){
    //created model is passed here to send the data after http link
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response =>{
      console.log(response)
    });
  }


  login(email: string, password: string){
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{token: string, expiresIn : number}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response =>{
      // console.log(response)
      const token = response.token
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn
        // console.log(expiresInDuration)
        this.setAuthTimer(expiresInDuration)
        //setting authentication status
        this.isAuthenticated = true
        this.authStatusListener.next(true);
        //calling saveAuthData to store the the token in local storage
        //As to pass the argument for expiration date, creating date
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
        console.log(expirationDate)
        this.saveAuthData(token, expirationDate)
      }

    })
  }

  getUserDetails(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${this.getToken()}`)
    }
    return this.http.get(
      `http://localhost:3000/api/user/getUserDetails`,header)
      .pipe(map((res) => res as any));

      // .subscribe(data =>{
      //   console.log(data)
      //   return data;
      // })

  }
  updateUserVote(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${this.getToken()}`)
    }
    return this.http.put(
      `http://localhost:3000/api/user/updateVote`,header)
      .pipe(map((res) => res as any));

      // .subscribe(data =>{
      //   console.log(data)
      //   return data;
      // })

  }

  //Automatically authenticate the user after storing the token in local storage
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    //checking expiration date is still in future
    const now = new Date()
    //getting the expirationtime
    const expiresIn = authInformation.expirationDate.getTime()  - now.getTime();
    //if the expirationtime is grater than 0 , the user is authenticated
    console.log(authInformation , expiresIn)
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      //calling settimer, if time is done, user will be logged out
      this.setAuthTimer(expiresIn /1000)
      this.authStatusListener.next(true)
    }
  }

  logout(){
    this.token=null;
    this.isAuthenticated= false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['']);

}

//Setting the time to get the duration
private setAuthTimer(duration : number){
  console.log("Setting timer: " + duration)
  this.tokenTimer = setTimeout(() =>{
    this.logout();
  }, duration *1000);
}

//Saving the token on local storage
private saveAuthData(token : string, expirationDate: Date){
  localStorage.setItem("token", token);
  //will not accept as date, so changing to string
  localStorage.setItem("expiration",expirationDate.toISOString())
}

//clearing token and will be called in log out
private clearAuthData(){
  localStorage.removeItem("token");
  localStorage.removeItem("expiration")
}

//Getting the token which is stored in local storage and will be called in autoAuthUser
private getAuthData(){
  const token = localStorage.getItem("token")
  const expirationDate = localStorage.getItem("expiration")
  //if we dont have expiration date either the token
  if( !token || !expirationDate){
    //return nothing
    return;
  }
  //else returning JS object
  return{
    token : token,
    expirationDate: new Date(expirationDate)
  }
}

}

