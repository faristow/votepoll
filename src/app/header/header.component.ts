import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy {

  userIsAuthenticated = false;
  private authListnerSubs : Subscription;

  constructor(private route : ActivatedRoute, public router: Router, private auth_service: AuthService) { }


  ngOnInit(): void {
    this.userIsAuthenticated = this.auth_service.getIsAuth();
    this.authListnerSubs = this.auth_service
    .getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  pollVote(){
    this.router.navigate([''])
  }

  logOut(){
    this.auth_service.logout()
  }

  ngOnDestroy(){
    this.authListnerSubs.unsubscribe();
  }
}
