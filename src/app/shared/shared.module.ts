import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MaterialModule } from '../modules/material/material.module';
import { FormGroup,FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,PopoverModule.forRoot(),MaterialModule,FormsModule,ReactiveFormsModule//,PushNotificationsModule
    ],

    declarations: [
        FooterComponent,
        HeaderComponent
    ],

    exports: [
        FooterComponent,
        HeaderComponent
    ]
})

export class SharedModule { }