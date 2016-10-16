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

  constructor(private router:Router,private _auth:AuthService) { }

  ngOnInit() {
    if(!localStorage.getItem('auth_token')){
      this.router.navigate(['/Login']);  
    }
  }

  logout(){
    localStorage.removeItem('auth_token');
    this.router.navigate(['/Login']);
  }

  pvtdata(){
    this._auth.pvtData()
      .subscribe(
        data=>console.log(data),
        err=>console.log(err),
        ()=>console.log('done')
      )
  }

}
