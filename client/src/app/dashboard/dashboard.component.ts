import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[AuthService]
})
export class DashboardComponent implements OnInit {

    public usr :Object={ "firstname":"", "lastname":"",  "email":"",   "country":"" };

  constructor(private router:Router,private _auth:AuthService) { }

  ngOnInit() {
    
    if(!localStorage.getItem('auth_token')){
      this.router.navigate(['/Login']);  
    }else{
      this.getUser();
    }
  }

  logout(){
    localStorage.removeItem('auth_token');
    this.router.navigate(['/Login']);
  }

  getUser(){
    this._auth.getUser()
      .map(res => res.json()) 
      .subscribe(
        data=>this.userProfile(data),
        err=>this.handleError(err),
        ()=>console.log('done')
      )
  }
  userProfile(data){
    {
      this.usr={
      "firstname":data.firstname,
      "lastname":data.lastname,
      "email":data.email,
      "country":data.country
      }
    }
  }

  handleError(e){
    localStorage.removeItem('auth_token');
    if(e.status==401){ //token expire handle
      this.router.navigate(['/Login']);
    }else{
      this.router.navigate(['/Login']);
    }
  }

}
