import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
  })
  export class HeaderComponent implements OnInit {
    IsCitizen:number=0;
    constructor( ){
            
    }
    ngOnInit(): void {
    }
    
  }
//   export class NavComponent {
//      collapsed = true;
//      toggleCollapsed(): void {
//        this.collapsed = !this.collapsed;
//      }
// }