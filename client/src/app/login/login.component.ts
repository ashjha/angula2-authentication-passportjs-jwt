import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {

  public user:any;
  public cb:any;

  constructor(
    private _auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user={username:'aj@gmail.com',password:'ashutoshjha'}
  }
  loginUsr() {
    this._auth.loginUsr(this.user)
      .map(res => res.json())
      .subscribe(
        data => this.loginsuccess(data),
        err => this.handleError(err),
        () => this.done()
      )
  }
  loginsuccess(d){
    this.cb=d.auth_token||d.msg;
    if(d.auth_token) {
      localStorage.setItem('auth_token',d.auth_token)
      this.router.navigate(['/Profile']);
    };
  }
  handleError(err){
    console.log(err);
    this.cb='Invalid credentials please try again';
  }
  done(){
    console.log('Done');
  }

}
