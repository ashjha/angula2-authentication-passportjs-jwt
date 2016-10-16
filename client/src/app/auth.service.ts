import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
    isLoggedin: boolean;

    constructor(private _http: Http) {

    }

    loginfn(usercreds) {
        /* this.isLoggedin = false;
         var headers = new Headers();
         var creds = 'name=' + usercreds.username + '&password=' + usercreds.password;
         headers.append('Content-Type', 'application/X-www-form-urlencoded');
         return new Promise((resolve) => {
         this._http.post('http://localhost:3333/authenticate', creds, {headers: headers}).subscribe((data) => {
             if(data.json().success) {
                 window.localStorage.setItem('auth_key', data.json().token);
                 this.isLoggedin = true;}
                 resolve(this.isLoggedin)
             }
         )
         
         })*/
    }

    loginUsr(usr){
        return this._http.post('http://localhost:3000/loginusr',usr);
    }

    pvtData(){
        var jwt = localStorage.getItem('auth_token');
        var authHeader = new Headers();        
        if(jwt){
            authHeader.append('Authorization','Bearer '+jwt);
        }
        return this._http.get('http://localhost:3000/pvtdata', {headers:authHeader});
    }

    ragisterUsr(usr) {       
        return this._http.post('http://localhost:3000/addnewusr',usr);            
    }
}