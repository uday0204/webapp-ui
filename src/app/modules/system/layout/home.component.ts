import { Component, OnInit } from '@angular/core';
 import { Router } from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   

  ngOnInit() {
  }

  isCollapsed = false;
  constructor(
    
    private router: Router,
   
  ) {}
  getAvatarInfo() {
    let user = {
      firstName: "U",
      lastName: "N",
      thumbnail: "",
    };
    
    

    return {
      ...user,
      size: "large",
    };
  }
  logoutHandler() {
    this.router.navigate(["/login"]);
  }

  useredit() {
    this.router.navigate(["/user"]);
  }

}
