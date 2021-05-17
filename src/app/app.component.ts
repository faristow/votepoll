import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // great plave to do our basic intializations. as this component loaded first
  title = 'votepoll';

  constructor(private auth_service : AuthService){}

  ngOnInit(): void {
    this.auth_service.autoAuthUser();
  }



}
