import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService]
})
export class SignupComponent implements OnInit {

  constructor(
    private _auth: AuthService,
    private router: Router
    ) { }

  newUsr: any;
  cb:any;

  ngOnInit() {
    this.frmReset();
  }

  frmReset(){
    this.newUsr = {
      fname: '',
      lname: '',
      email: '',
      country: '',
      password: ''
    }
  }

  ragisterUsr() {
    this._auth.ragisterUsr(this.newUsr)
      .map(res => res.json())
      .subscribe(
        data => this.ragistersuccess(data),
        err => this.cb=err,
        () => this.done()
      )
  }

  ragistersuccess(d){
    this.cb=d.msg;
    setTimeout(() => {
      if(d.success) this.router.navigate(['/Login']);
    }, 5000);  
  }

  done(){  
    setTimeout(() => {
      this.cb='';
      this.frmReset();
    }, 5000);  
  }
}
