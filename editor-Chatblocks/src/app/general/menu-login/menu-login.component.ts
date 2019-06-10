import { Component, OnInit } from '@angular/core';

import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import {Globals} from '../bloques/interfaces/Globals';

@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html',
  styleUrls: ['./menu-login.component.css']
})
export class MenuLoginComponent implements OnInit {

  user: SocialUser;

  constructor(private authService: AuthService, public globals: Globals) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if(this.user!=null){
        this.globals.estado='in';
        this.globals.user=this.user;
        console.log("Usuario valido-> "+user+", globals->"+this.globals.user);
      }else{
        this.globals.estado='out';
        this.globals.user='';
        console.log("Usuario out-> "+user+", globals->"+this.globals.user);
      }
        
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    console.log("Usuario1-> "+this.user);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log("Usuario2-> "+this.user);
  }

  signInWithLinkedIn(): void {
    this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID);
    console.log("Usuario3-> "+this.user);
  }

  signOut(): void {
    this.authService.signOut();
  }

}
