import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Global } from '../../../shared/global';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { decrypt } from 'src/app/utils/encrypt';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  AbanList: any = null;
  ErrorMsg: any;
  SuccessMsg: any;
  indLoading = false;
  LoaderImage: any;
  SearchForm: FormGroup;
  searchclicked = 0;
  IsCitizenRequest: boolean = true;
  verificationCode = ''
  token = '';
  constructor(private _dataService: DataService,
    private router: Router,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute, ) {
    activatedRoute.params.subscribe(val => {
      let that = this;

    });
    this.activatedRoute.queryParams.subscribe(params => {
      let iscitizen = params.Ic;
      if (iscitizen == 1) {
        this.IsCitizenRequest = true;
      }
    });
  }
  private createForm() {
    this.SearchForm = new FormGroup({
      ComplaintNoFormControl: new FormControl('', [Validators.required]),
      VerificationCodeFormControl: new FormControl('')
    });
  }
  ngOnInit() {
    this.createForm();
  }
  LoadAbanList(pageNumber, pageSize, obj): void {
    this.ErrorMsg = "";
    this.SuccessMsg = "";
    var searchCounter = 0
    var SearchComplaintNo = "";
    var violationFrmDate_datestring = "";
    var violationToDate_datestring = "";
    var violationSearchReason_ID = "";
    var voilationSearchLOCType_ID = "";
    var violationviolationStaus_ID = null;
    var SearchRecId = 0;
    var SearchPlateNo = "";
    var SearchVinNo = "";
    var SearchRequestBy = "";
    var SearchComplaintNo = "";
    var searchCreatedBy = null;
    var IsDispatchEligible = false;
    var searchobj = {};



    if (obj.ComplaintNoFormControl !== undefined && obj.ComplaintNoFormControl !== "") {
      SearchComplaintNo = obj.ComplaintNoFormControl;
      searchCounter++
    }


    if (searchCounter == 0) {
      this.ErrorMsg = "Please enter Complaint No";

    } else {
      searchobj = {
        "id": SearchRecId,
        "createdby": searchCreatedBy,
        "statusid": violationviolationStaus_ID,
        "frmDate": violationFrmDate_datestring,
        "toDate": violationToDate_datestring,
        "voilationReasonid": violationSearchReason_ID,
        "textlocationid": voilationSearchLOCType_ID,
        "LicNo": SearchPlateNo,
        "carvin_id": SearchVinNo,
        "reqBy": SearchRequestBy,
        "complaintno": SearchComplaintNo,
        "offset": pageNumber,
        "counter": pageSize,
        "IsDispatchEligible": IsDispatchEligible,
        "MakeId": 0,
        "ModelId": 0,
        "Location": '',
        "StyleId": 0,
        "ColorId": 0,
        "LastName": ""
      };
      this.indLoading = true;
      this._dataService.postWithHeader(Global.DLMS_API_URL + 'api/Aban/SearchByOtp', searchobj,'Authorization',this.token)
        .subscribe(items => {
          this.AbanList = items;
          if (this.AbanList != null) {
            if (this.AbanList.length > 0) {
              this.indLoading = false;
            }
            else {
              this.indLoading = false;
            }
          } else {
            this.indLoading = false;
          }
        },
          error => {
            this.indLoading = false;
            this.ErrorMsg = <any>error
          });

    }
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
  Search(obj) {
    if(this.token!=''){
      this.LoadAbanList(1, 1, obj)
    }else{
      this.validateAllFormFields(this.SearchForm);
      if (this.SearchForm.valid) {
        this.searchclicked++;
        const formData = this.SearchForm.value
        this._dataService.get(Global.DLMS_API_URL + `api/Aban/SearchByOtpComplaintNo?ComplaintNo=${formData.ComplaintNoFormControl}`)
        .subscribe(items => {
          
          const decodedData = decrypt(items.data);
          const dataParsed = JSON.parse(decodedData);
          
          if(dataParsed == null){
            this.ErrorMsg = "No record found";
            setTimeout(() => {
              this.ErrorMsg = "";
            }, 3000);
          }
          
          this.AbanList = dataParsed;
          this.indLoading = false;
          // this.verificationCode = '123422'
        },
          error => {
            this.indLoading = false;
            this.ErrorMsg = <any>error
          });
      }
    }
  }

  verify(obj){
    this.validateAllFormFields(this.SearchForm);
          if (this.SearchForm.valid) {
            this.searchclicked++;
            const formData = this.SearchForm.value
            this._dataService.get(Global.DLMS_API_URL + `api/Aban/verifyVerificationCode?code=${formData.VerificationCodeFormControl}`)
            .subscribe(items => {
              this.token = items.token;
              this.indLoading = false;
              
            },
              error => {
                this.indLoading = false;
                this.ErrorMsg = <any>error
              });
          }
    }
}
