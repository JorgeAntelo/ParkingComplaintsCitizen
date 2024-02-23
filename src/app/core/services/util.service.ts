import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class UtilService {
  removeColumnList: any = ['TotalRecords','TotalPages']; 
  constructor() { }

  getKeys(obj){
    return Object.keys(obj)
  }
  
  getType(x) {
    return typeof x;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
