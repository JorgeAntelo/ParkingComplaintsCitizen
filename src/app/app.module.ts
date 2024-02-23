import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LocalStorageModule } from 'angular-2-local-storage';
import { TimepickerModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './shared/shared.module';
import { DataService } from './core/services/data.service';
import { NavigationService } from './shared/components/navigation/navigation.service';
import { ExcelService } from './core/services/excel.service';
import { CommunicationService } from './core/services/app.communication.service';
import { UtilService } from './core/services/util.service';
import { PipesModule } from './pipes/pipes.module';
import {ComplaintModule} from './complaint/complaint.module'
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutes,
    CoreModule.forRoot(),
    MaterialModule,
    SharedModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    NgxSpinnerModule,
    PipesModule,
    ComplaintModule
  ],

  providers: [DataService, NavigationService, ExcelService, CommunicationService, UtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
