import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { NavigationService } from './shared/components/navigation/navigation.service';
import { VersionCheckService } from './core/services/version-check.service';
import { environment } from '../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Complaints';
  IsCitizen:number=1;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService, 
    public nav: NavigationService,
    private versionCheckService: VersionCheckService,
    private router: Router, 
    private spiner: NgxSpinnerService) { 
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.Ic!==undefined) {
            this.IsCitizen=params.Ic;
          }
          
    });
    }

  @ViewChild('template') public template: TemplateRef<any>;

  ngOnInit(): void {
    /*
    console.log('AppComponent.ngOnInit() environment.versionCheckUrl=' + environment.versionCheckUrl);
    if (environment.versionCheckUrl) {
      this.versionCheckService.initVersionCheck(environment.versionCheckUrl, this.template);
    }
    */
  }

  confirm(): void {
    location.reload();
  }

}
