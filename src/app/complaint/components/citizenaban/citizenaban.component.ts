import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild,ElementRef ,NgZone} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Global } from '../../../shared/global';
import { TimepickerModule } from 'ngx-bootstrap';
import { MatOptionSelectionChange, fadeInContent } from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AgmCoreModule, MapsAPILoader } from "@agm/core";
import { isNullOrUndefined } from "util";
import 'hammerjs';

@Component({
  selector: 'app-citizenaban',
  templateUrl: './citizenaban.component.html',
  styleUrls: ['./citizenaban.component.css']
})
export class CitizenabanComponent implements OnInit {
  @ViewChild('templateConfirm') public templateConfirm: TemplateRef<any>;
  @ViewChild('templateCancel') public templateCancel: TemplateRef<any>;
  @ViewChild('templateAssign') public templateAssign: TemplateRef<any>;
  @ViewChild('Address') AddressElementRef: ElementRef;
  public modalConfirmRef: BsModalRef;
  public modalCancelRef: BsModalRef;
  public modalAssignRef: BsModalRef;
  public config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };
  ErrorMsg: any;
  SuccessMsg: any;
  CurrentDate: Date;
  AbanForm: FormGroup;
  Officers: any; filteredOfficers: Observable<any[]>;
  states: any; filteredStates: Observable<any[]>;

  LocationTypeList = [];
  IsVinUnavailable = false;
  IsPlateUnavailable = false;
  Isinvalid: boolean;
  vinchange: any;
  isOtherMakeVisible = false;
  isOtherModelVisible = false;
  ViolationReasonList = []; filteredViolationReasons: Observable<any[]>;
  MakeList = []; filteredMakes: Observable<any[]>;
  ModelList = []; filteredModels: Observable<any[]>;
  StyleList = []; filteredStyles: Observable<any[]>;
  ColorList = []; filteredColors: Observable<any[]>;
  carvin_id: number;
  indLoading: boolean;
  LoaderImage: any;
  AbanId: number = -1; StatusId: any; RecordId: any; Status: any; DATE: any; UserId: Number;
  phonemask: any[] = Global.phonemask;
  ControlID = "OL1";
  cancelreasons = []; CancelReasonId: number;
  PEOfficers = [];
  IsCitizenRequest: boolean = false;
  Header: any = "Parking Complaint";
  IsDispatchEligible: boolean = false;
  IsAdmin: boolean = false;
  ComplaintNo: any; HasComplaintNo: boolean = false; IsInterval: any; IsAban: boolean;
  IsAlley: boolean=false; IsStreet: boolean=false; IsPrivate: boolean=false;
  ReasonDescription:any="";
  constructor(private _dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private modalService: BsModalService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, ) {
    activatedRoute.params.subscribe(val => {
      //console.log(val);
      let AbanId = val.Id;
      let that = this;

    });
    this.activatedRoute.queryParams.subscribe(params => {

      let AbanId = params.Id;

      let LoggeduserId = params.UserId;
      let iscitizen = params.Ic;
      let token = params.Token;
      if (iscitizen == 1) {
        this.IsCitizenRequest = true;
        this.Header = "Report Parking Violation";
      }
      if (LoggeduserId) {
        this.UserId = Number(LoggeduserId);
        this.IsAdmin = Boolean(params.Ia);
        // console.log(this.UserId);
      }

      if (token != '0' && token != '-1' && token != '' && token != undefined) {
        this._dataService.get(Global.DLMS_API_URL + 'api/Aban/getAbanIdfromToken?token=' + token)
          .subscribe(id => {
            this.createForm();
            this.LoadAbanDetails(id);
          }, error => {
            this.indLoading = false;
            this.ErrorMsg = <any>error
          });
      } else {
        this.IsCitizenRequest = true;
        if (AbanId) {

          this.createForm();
          this.LoadAbanDetails(AbanId);
        } else {

          this.createForm();
          this.ResetForm();
        }
      }


    });
  }
  ngAfterViewInit() {
    this.LoaderImage = Global.FullImagePath;
    this.IsCitizenRequest = true;
    this.Header = "Report Parking Violation";
    // console.log("call ngAfterViewInit");
  }
  ngOnInit() {
    this.LoaderImage = Global.FullImagePath;
    this.CurrentDate = new Date();
    this.StatusId = 1;
    this.LoadViolationReason(0);
    //this.LoadOfficers(0);
    //this.LoadLocationType(0);
    this.LoadStates(0);
    this.LoadMake(0, 0);
    this.LoadStyles(0);
    this.LoadColors(0);
    this.createForm();
    this.LoadCancelReasons();
    this.LoadPEOfficers();
    this.googleAutoComplete();
  }
  private createForm() {
    
    this.AbanForm = new FormGroup({
      OfficerNameFormControl: new FormControl(''),
      BadgeFormControl: new FormControl(''),
      DateFormControl: new FormControl(''),
      TimeFormControl: new FormControl(''),
      AddressFormControl: new FormControl('', [Validators.required]),
      ViolationReasonFormControl: new FormControl('', [Validators.required]),
      // LocationTypeFormControl: new FormControl('', [Validators.required]),
      BusinessFormControl: new FormControl(''),
      RequestedByFormControl: new FormControl(''),
      RequestedByLastFormControl: new FormControl(''),
      PlateFormControl: new FormControl(''),
      LicPlateUnavailableFormControl: new FormControl(''),
      StateFormControl: new FormControl(''),
      VINFormControl: new FormControl(''),
      VinUnavailableFormControl: new FormControl(''),
      YearFormControl: new FormControl(),
      MakeFormControl: new FormControl(),
      OtherMakeFormControl: new FormControl(),
      ModelFormControl: new FormControl(),
      PhoneFormControl: new FormControl('', [Validators.maxLength(15), Validators.pattern(Global.PHONE_REGEX)]),
      EmailFormControl: new FormControl('', [Validators.pattern(Global.EMAIL_REGEX), Validators.maxLength(50)]),
      InstructionsFormControl: new FormControl('', [Validators.required]),
      OtherModelFormControl: new FormControl(),
      StyleFormControl: new FormControl(''),
      ColorFormControl: new FormControl(''),
      EmailOutFormControl: new FormControl(''),
      IsAlleyFormControl: new FormControl(''),
      IsStreetFormControl: new FormControl(''),
      IsPrivateFormControl: new FormControl(''),
    });

    this.SetValueandValidation(this.IsCitizenRequest);

  }
  SetValueandValidation(iscitizen) {
    var objdate = new Date();
    var time = objdate.toTimeString().slice(0, 5);//objdate.getHours() + ':' + objdate.getMinutes() ;
// “Location of Violation”, “Violation Reason”, “Alley or Street” (Checkbox), “Color” and “Description”
    if (iscitizen == 1) {
      // (<FormControl>this.AbanForm.controls['RequestedByFormControl']).setValidators([Validators.required]);
      // (this.AbanForm.controls['RequestedByFormControl']).updateValueAndValidity();
      // (<FormControl>this.AbanForm.controls['RequestedByLastFormControl']).setValidators([Validators.required]);
      // (this.AbanForm.controls['RequestedByLastFormControl']).updateValueAndValidity();
      // (<FormControl>this.AbanForm.controls['PhoneFormControl']).setValidators([Validators.required, Validators.maxLength(15), Validators.pattern(Global.PHONE_REGEX)]);
      // (this.AbanForm.controls['PhoneFormControl']).updateValueAndValidity();
      (<FormControl>this.AbanForm.controls['EmailFormControl']).setValidators([Validators.pattern(Global.EMAIL_REGEX), Validators.maxLength(50)]);
      (this.AbanForm.controls['EmailFormControl']).updateValueAndValidity();
      // (<FormControl>this.AbanForm.controls['LocationTypeFormControl']).setValidators(null);
      // (this.AbanForm.controls['LocationTypeFormControl']).updateValueAndValidity();
       (<FormControl>this.AbanForm.controls['ColorFormControl']).setValidators([Validators.required]);
       (this.AbanForm.controls['ColorFormControl']).updateValueAndValidity();
       (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValidators([Validators.requiredTrue]);
      (this.AbanForm.controls['IsAlleyFormControl']).updateValueAndValidity();
      (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValidators([Validators.requiredTrue]);
      (this.AbanForm.controls['IsStreetFormControl']).updateValueAndValidity();
    }
    (<FormControl>this.AbanForm.controls['DateFormControl']).setValue(objdate, {});
    (this.AbanForm.controls['DateFormControl']).updateValueAndValidity();
    (<FormControl>this.AbanForm.controls['TimeFormControl']).setValue(time, {});
    (this.AbanForm.controls['TimeFormControl']).updateValueAndValidity();
  }
  AddNew() {

    this.ResetForm();
    let url = '/home';
    this.router.navigateByUrl(url);
  }
  ResetForm() {
    this.AbanId = -1;
    this.StatusId = 1;
    this.ReasonDescription="";
    this.AbanForm.reset();
    this.LoadStates(0);
    /*var objdate = new Date();
    var time = objdate.toTimeString().slice(0, 5);//objdate.getHours() + ':' + objdate.getMinutes() ;
    (<FormControl>this.AbanForm.controls['DateFormControl']).setValue(objdate, {});
    (this.AbanForm.controls['DateFormControl']).updateValueAndValidity();
    (<FormControl>this.AbanForm.controls['TimeFormControl']).setValue(time, {});
    (this.AbanForm.controls['TimeFormControl']).updateValueAndValidity();*/
    this.SetValueandValidation(this.IsCitizenRequest);

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
  Save(obj) {
    this.indLoading = true;
    this.SuccessMsg = "";
    this.ErrorMsg = "";
    let origAbanId = this.AbanId;
    this.validateAllFormFields(this.AbanForm);
    if (this.AbanForm.valid) {
      var makeid = null;
      var modelid = null;
      var styleid = null;
      var colorid = null;
      var stateid = null;
      if (obj.MakeFormControl) {
        makeid = obj.MakeFormControl.Make_Id;
      }
      if (obj.ModelFormControl) {
        modelid = obj.ModelFormControl.Model_Id;
      }

      if (obj.StyleFormControl) {
        styleid = obj.StyleFormControl.Style_Id;
      }

      if (obj.ColorFormControl) {
        colorid = obj.ColorFormControl.Color_Id;
      }
      if (obj.StateFormControl) {
        stateid = obj.StateFormControl.StateId;
      }

      var objdate = new Date();
      var time = objdate.toTimeString().slice(0, 5);
      (<FormControl>this.AbanForm.controls['DateFormControl']).setValue(objdate, {});
      (this.AbanForm.controls['DateFormControl']).updateValueAndValidity();
      (<FormControl>this.AbanForm.controls['TimeFormControl']).setValue(time, {});
      (this.AbanForm.controls['TimeFormControl']).updateValueAndValidity();

      this.indLoading = true;
      var vinid = null;
      if (this.carvin_id) {
        vinid = this.carvin_id;

      }
      //console.log(this.UserId);
      var abanobj =
        {
          "AbanId": this.AbanId,
          "UserId": this.UserId,
          //"OfficerName": obj.OfficerNameFormControl,
          //"BadgeNo": obj.BadgeFormControl,
          "Time": obj.TimeFormControl,
          "Date": obj.DateFormControl,
          "ViolationReasonId": obj.ViolationReasonFormControl.ABAN_REASON_ID,
          "Location": obj.AddressFormControl,
          // "ViolationTypeId": 0,//obj.LocationTypeFormControl.LOCATION_TYPE_ID,
          "BusName": obj.BusinessFormControl,
          "Rname": obj.RequestedByFormControl,
          "Lname": obj.RequestedByLastFormControl,
          "LicNo": obj.PlateFormControl,
          "StateId": stateid,//obj.StateFormControl.StateId,
          //"carvin_id": vinid,
          "Year": obj.YearFormControl,
          "MakeId": makeid,// obj.MakeFormControl.Make_Id,
          "ModelId": modelid,//obj.ModelFormControl.Model_Id,
          // "Vin": obj.VINFormControl,
          // "Style": obj.VINFormControl,
          "StyleId": styleid,//obj.StyleFormControl.Style_Id,
          "ColorId": colorid,//obj.ColorFormControl.Color_Id,
          "Phone": obj.PhoneFormControl,
          "Email": obj.EmailFormControl,
          "Instructions": obj.InstructionsFormControl,
          "IsPriority": false,
          "SendMail": true,
          "IsAlley": this.IsAlley,
          "IsStreet": this.IsStreet,
          "IsPrivate": this.IsPrivate,          
        };
      //console.log(abanobj);
      this._dataService.post(Global.DLMS_API_URL + 'api/Aban/rcedUpdate', abanobj)
        .subscribe(items => {
          this.AbanId = items.Id;
          if (items.result !== "Success") {
            this.ComplaintNo = items.result;
            this.HasComplaintNo = true;
            if (this.IsCitizenRequest) {
              let url = '/complaint?compno=' + this.ComplaintNo;
              this.router.navigateByUrl(url);
            }

          } else {
            this.HasComplaintNo = false;
          }

          this.indLoading = false;
          // this.ABAN_ID = items[0].[""];
          this.LoadAbanDetails(this.AbanId);
          if (items.Id > 0) {
            if (origAbanId == 0) {
              this.SuccessMsg = "Record Initiated Successfully."
            } else {

              this.SuccessMsg = "Record Updated Successfully."
            }

          } else {
            this.ErrorMsg = "Record Update Failed. Please try again.";
          }
        },
          error => {
            this.HasComplaintNo = false;
            this.indLoading = false;
            this.ErrorMsg = <any>error
          });
    } else {
      this.indLoading = false;
    }

  }
  LoadAbanDetails(AbanId) {
    if (AbanId == 0 || AbanId == null) {
      AbanId = -1;
    }

    var searchobj = {
      "id": AbanId,
      "createdby": null,
      "statusid": null,
      "frmDate": '',
      "toDate": '',
      "voilationReasonid": null,
      "textlocationid": null,
      "LicNo": '',
      "carvin_id": '',
      "reqBy": '',
      "complaintno": '',
      "offset": 1,
      "counter": 1,
      "IsDispatchEligible": null,
      "MakeId": 0,
      "ModelId": 0,
      "Location": '',
      "StyleId": 0,
      "ColorId": 0,
      "LastName": "",
      "IsTimeLapsed": false,
      "EnteredBy": 0
    };

    this.indLoading = true;
    this._dataService.post(Global.DLMS_API_URL + 'api/Aban/Search', searchobj)
      .subscribe(items => {
        // console.log(items);
        if (items.length == 1) {
          var item = items[0];
          this.CancelReasonId = item.CancelReasonId;
          this.DATE = item.DATE;
          this.AbanId = item.ABANID;
          this.StatusId = item.StatusId;
          this.Status = item.Status;
          this.RecordId = item.RecordId;
          this.IsAban = item.IsAban;
          this.IsDispatchEligible = item.IsDispatchEligible;
          if (item.ComplaintNo) {
            this.ComplaintNo = item.ComplaintNo;
            this.HasComplaintNo = true;
          } else {
            this.HasComplaintNo = false;
          }
          this.IsAlley=item.IsAlley;
          this.IsStreet=item.IsStreet;
          this.IsPrivate=item.IsPrivate;

          (<FormControl>this.AbanForm.controls['OfficerNameFormControl']).setValue(item.OfficerName, {});
          (this.AbanForm.controls['OfficerNameFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['BadgeFormControl']).setValue(item.BadgeNum, {});
          (this.AbanForm.controls['BadgeFormControl']).updateValueAndValidity();
          var objdate = new Date(item.DATE);
          // var time =  objdate.getHours() + ':' + objdate.getMinutes() ;//+ ':' + objdate.getSeconds();
          var time = objdate.toTimeString().slice(0, 5);

          (<FormControl>this.AbanForm.controls['DateFormControl']).setValue(objdate, {});
          (this.AbanForm.controls['DateFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['TimeFormControl']).setValue(time, {});
          (this.AbanForm.controls['TimeFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['AddressFormControl']).setValue(item.LOCATION, {});
          (this.AbanForm.controls['AddressFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['BusinessFormControl']).setValue(item.Business, {});
          (this.AbanForm.controls['BusinessFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['RequestedByFormControl']).setValue(item.RequestedBy, {});
          (this.AbanForm.controls['RequestedByFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['RequestedByLastFormControl']).setValue(item.RequestedByLast, {});
          (this.AbanForm.controls['RequestedByLastFormControl']).updateValueAndValidity();

          (<FormControl>this.AbanForm.controls['PlateFormControl']).setValue(item.LicNo, {});
          (this.AbanForm.controls['PlateFormControl']).updateValueAndValidity();
          if (item.LicNo == "No Plate") {
            (<FormControl>this.AbanForm.controls['LicPlateUnavailableFormControl']).setValue(true, {});
            (this.AbanForm.controls['LicPlateUnavailableFormControl']).updateValueAndValidity();
          }
          (<FormControl>this.AbanForm.controls['VINFormControl']).setValue(item.VINNUM, {});
          (this.AbanForm.controls['VINFormControl']).updateValueAndValidity();
          if (item.VINNUM == "No VIN") {
            (<FormControl>this.AbanForm.controls['VinUnavailableFormControl']).setValue(true, {});
            (this.AbanForm.controls['VinUnavailableFormControl']).updateValueAndValidity();
          } else {
            this.LoadVinDetails(item.VINNUM);

          }
          if (item.MakeId > 0) {
            this.LoadMake(item.MakeId, item.ModelId);
          } else {
            this.LoadMake(0, 0);
          }
          //this.LoadOfficers(item.OfficerId);
          if(item.CitizenVioReason>0){
            this.LoadViolationReason(item.CitizenVioReason);
          }else{
            this.LoadViolationReason(item.ReasonId);

          }
          //this.LoadLocationType(item.LocTypeId);
          this.LoadStates(item.StateId);
          this.LoadStyles(item.StyleId);
          this.LoadColors(item.ColorId);
          /**/
          (<FormControl>this.AbanForm.controls['YearFormControl']).setValue(item.Year, {});
          (this.AbanForm.controls['YearFormControl']).updateValueAndValidity();

          (<FormControl>this.AbanForm.controls['PhoneFormControl']).setValue(item.Phone, {});
          (this.AbanForm.controls['PhoneFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['EmailFormControl']).setValue(item.Email, {});
          (this.AbanForm.controls['EmailFormControl']).updateValueAndValidity();
          // (<FormControl>this.AbanForm.controls['EmailOutFormControl']).setValue(item.SendEmail, {});
          // (this.AbanForm.controls['EmailOutFormControl']).updateValueAndValidity();
          (<FormControl>this.AbanForm.controls['InstructionsFormControl']).setValue(item.Instructions, {});
          (this.AbanForm.controls['InstructionsFormControl']).updateValueAndValidity();
          /*let isalley = "";let isstreet = "";let isprivate = "";
          if (item.IsAlley) {
            isalley = "true";
          } else {
            isalley = "false";
          }     */     
          (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValue(item.IsAlley, {});
          (this.AbanForm.controls['IsAlleyFormControl']).updateValueAndValidity();
          /*if (item.IsStreet) {
            isstreet = "true";
          } else {
            isstreet = "false";
          } */         
          (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValue(item.IsStreet, {});
          (this.AbanForm.controls['IsStreetFormControl']).updateValueAndValidity();
          /*if (item.IsPrivate) {
            isprivate = "true";
          } else {
            isprivate = "false";
          } */         
          (<FormControl>this.AbanForm.controls['IsPrivateFormControl']).setValue(item.IsPrivate, {});
          (this.AbanForm.controls['IsPrivateFormControl']).updateValueAndValidity();
       

        } else {
          this.ErrorMsg = "No Record Found"
        }
        this.indLoading = false;
      },
        error => {
          this.indLoading = false;
          this.ErrorMsg = <any>error
        });

  }

  /*****ViolationReason */
  resetViolationReason(): void {
    setTimeout(() => {
      (this.AbanForm.controls['ViolationReasonFormControl']).setValue(null);
      this.ReasonDescription="";
    }, 1);
  }
  filterViolationReasons(val) {
    return val ? this.ViolationReasonList.filter(s => s.ABAN_REASON_DESC.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.ViolationReasonList;
  }
  displayFnViolationReason(ViolationReason): string {    
    return ViolationReason ? ViolationReason.ABAN_REASON_DESC : ViolationReason;
  }
  LoadViolationReason(reasonid): void {
    this.ViolationReasonList = [];
    this._dataService.get(Global.DLMS_API_URL + 'api/Aban/GetSrchVioReason').subscribe(
      list => {
        if (list) {

          this.ViolationReasonList = list.filter(s => s.ForCitizen == true);
          this.filteredViolationReasons = this.AbanForm.controls['ViolationReasonFormControl'].valueChanges
            .startWith(null)
            .map(ViolationReason => ViolationReason && typeof ViolationReason === 'object' ? ViolationReason.ABAN_REASON_DESC : ViolationReason)
            .map(name => this.filterViolationReasons(name));

          if (reasonid > 0) {
            for (let obj of this.ViolationReasonList) {
              if (reasonid == obj.ABAN_REASON_ID) {
                (<FormControl>this.AbanForm.controls['ViolationReasonFormControl'])
                  .setValue(obj, {});
                  this.ReasonDescription=obj.Description;

              }
            }
          }

        } else {
          this.ViolationReasonList = [];
        }


      },
      error => (this.ErrorMsg = <any>error)
    );
  }
  /*LoadLocationType(typeid): void {
    this.LocationTypeList = [];
    this._dataService.get(Global.DLMS_API_URL + 'api/Aban/GetSrchVioLOCType').subscribe(
      list => {
        if (list) {

          this.LocationTypeList = list;

          if (typeid > 0) {
            for (let obj of this.LocationTypeList) {
              if (typeid == obj.LOCATION_TYPE_ID) {
                (<FormControl>this.AbanForm.controls['LocationTypeFormControl'])
                  .setValue(obj, {});

              }
            }
          }
        } else {
          this.LocationTypeList = [];
        }


      },
      error => (this.ErrorMsg = <any>error)
    );
  }*/
  //States
  /*****States */
  reset(): void {
    setTimeout(() => {
      (this.AbanForm.controls['StateFormControl']).setValue(null);
    }, 1);
  }
  filterStates(val) {
    return val ? this.states.filter(s => s.State_Code.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.states;
  }
  displayFn(state): string {
    return state ? state.State_Code : state;
  }
  LoadStates(StateId): void {
    this._dataService.get(Global.DLMS_API_URL + 'api/Request/GetState?CountryId=1')
      .subscribe(states => {
        this.states = states;
        this.filteredStates = this.AbanForm.controls['StateFormControl'].valueChanges
          .startWith(null)
          .map(state => state && typeof state === 'object' ? state.Name : state)
          .map(name => this.filterStates(name));
        if (StateId > 0) {
          for (let state of this.states) {
            if (StateId == state.StateId) {
              (<FormControl>this.AbanForm.controls['StateFormControl'])
                .setValue(state, {});

            }
          }
        } else {
          for (let state of this.states) {
            if (Global.StateId == state.StateId) {
              (<FormControl>this.AbanForm.controls['StateFormControl'])
                .setValue(state, {});

            }
          }

        }
      },
        error => this.ErrorMsg = <any>error);
  }
  /*****Style */
  resetStyle(): void {
    setTimeout(() => {
      (this.AbanForm.controls['StyleFormControl']).setValue(null);
    }, 1);
  }
  filterStyles(val) {
    return val ? this.StyleList.filter(s => s.Description.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.StyleList;
  }
  displayFnStyle(style): string {
    return style ? style.Description : style;
  }
  LoadStyles(StyleId): void {
    this._dataService.get(Global.DLMS_API_URL + 'api/aban/SelectVehicleStyles')
      .subscribe(list => {
        this.StyleList = list;
        this.filteredStyles = this.AbanForm.controls['StyleFormControl'].valueChanges
          .startWith(null)
          .map(style => style && typeof style === 'object' ? style.Description : style)
          .map(name => this.filterStyles(name));
        if (StyleId > 0) {
          for (let style of this.StyleList) {
            if (StyleId == style.Style_Id) {
              (<FormControl>this.AbanForm.controls['StyleFormControl'])
                .setValue(style, {});

            }
          }
        }
      },
        error => this.ErrorMsg = <any>error);
  }
  /*****Color */
  resetColor(): void {
    setTimeout(() => {
      (this.AbanForm.controls['ColorFormControl']).setValue(null);
    }, 1);
  }
  filterColors(val) {
    return val ? this.ColorList.filter(s => s.Description.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.ColorList;
  }
  displayFnColor(Color): string {
    return Color ? Color.Description : Color;
  }
  LoadColors(ColorId): void {
    this._dataService.get(Global.DLMS_API_URL + 'api/Color')
      .subscribe(list => {
        this.ColorList = list;
        this.filteredColors = this.AbanForm.controls['ColorFormControl'].valueChanges
          .startWith(null)
          .map(Color => Color && typeof Color === 'object' ? Color.Description : Color)
          .map(name => this.filterColors(name));
        if (ColorId > 0) {
          for (let Color of this.ColorList) {
            if (ColorId == Color.Color_Id) {
              (<FormControl>this.AbanForm.controls['ColorFormControl'])
                .setValue(Color, {});

            }
          }
        }
      },
        error => this.ErrorMsg = <any>error);
  }
  //Officers
  /*
  LoadOfficers(officerid): void {
    this._dataService.get(Global.DLMS_API_URL + 'api/Aban/GetUsers')
      .subscribe(officers => {
        this.Officers = officers;
        this.filteredOfficers = this.AbanForm.controls['OfficerNameFormControl'].valueChanges
          .startWith(null)
          .map(type => type && typeof type === 'object' ? type.FullName : type)
          .map(name => this.filterOfficers(name));

        if (officerid > 0) {
          for (let obj of this.Officers) {
            if (officerid == obj.User_Id) {
              (<FormControl>this.AbanForm.controls['OfficerNameFormControl'])
                .setValue(obj, {});
            }
          }
        }
      },
        error => this.ErrorMsg = <any>error);
  }

  Officerreset(): void {
    setTimeout(() => {
      (this.AbanForm.controls['OfficerNameFormControl']).setValue(null);
      (this.AbanForm.controls["BadgeFormControl"]).setValue(null, {});
    }, 1);
  }

  filterOfficers(val) {
    return val ? this.Officers.filter(s => s.FullName.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.Officers;
  }

  OfficerdisplayFn(type): string {
    return type ? type.FullName : type;
  }

  onSelectOfficer(evt: MatOptionSelectionChange, BadgeNum: any): void {
    if (evt.source.selected) {
      setTimeout(() => {
        //alert(BadgeNum);
        (this.AbanForm.controls["BadgeFormControl"]).setValue(BadgeNum);
        //(this.AbanForm.controls['BadgeFormControl']).updateValueAndValidity();
      }, 1);
    }
  }
*/
  ChangeAvailability(event, type: any) {
    if (type == 'vin') {

      if (event.checked == true) {
        this.IsVinUnavailable = false;
        this.AbanForm.controls.VINFormControl.disable();
      } else {
        this.IsVinUnavailable = true;
        this.AbanForm.controls.VINFormControl.enable();
      }
      if (!this.AbanForm.getRawValue().VinUnavailableFormControl) {
        (<FormControl>this.AbanForm.controls['VINFormControl']).setValue('', {});
        (this.AbanForm.controls['VINFormControl']).setValidators(Validators.required);
        (this.AbanForm.controls['VINFormControl']).updateValueAndValidity();
      }
      else {
        (<FormControl>this.AbanForm.controls['VINFormControl']).setValue('No VIN', {});
        (this.AbanForm.controls['VINFormControl']).setValidators(null);
        (this.AbanForm.controls['VINFormControl']).updateValueAndValidity();
      }
    } else if (type == 'license') {
      if (!this.AbanForm.getRawValue().LicPlateUnavailableFormControl) {
        (<FormControl>this.AbanForm.controls['PlateFormControl']).setValue('', {});
        (this.AbanForm.controls['PlateFormControl']).setValidators(Validators.required);
        (this.AbanForm.controls['PlateFormControl']).updateValueAndValidity();
      }
      else {
        (<FormControl>this.AbanForm.controls['PlateFormControl']).setValue('No Plate', {});
        (this.AbanForm.controls['PlateFormControl']).setValidators(null);
        (this.AbanForm.controls['PlateFormControl']).updateValueAndValidity();
      }
    }

  }
  onChange(event: any) {

    this.Isinvalid = false;
    this.vinchange = event.target.value;
    this.LoadVinDetails(this.vinchange);

  }
  LoadVinDetails(vinchange) {
    this._dataService.get(Global.DLMS_API_URL + 'api/Aban/GetCarDetails?vinnumber=' + vinchange)
      .subscribe(Vinobj => {

        if (Vinobj == null || Vinobj.length < 1) {
          this.carvin_id = null;
          this.Isinvalid = false;
          //this.AbanForm.controls.YearFormControl.reset();
          //this.AbanForm.controls.MakeFormControl.reset();
          //this.AbanForm.controls.ModelFormControl.reset();
        }
        else {

          this.carvin_id = Number(Vinobj[0].VIN_ID);
          this.Isinvalid = true;
          this.AbanForm.controls.YearFormControl.setValue(Vinobj[0].YEAR);
          this.AbanForm.controls.MakeFormControl.setValue(Number(Vinobj[0].MAKE_ID));
          this.LoadModel(Number(Vinobj[0].MAKE_ID));
          this.AbanForm.controls.ModelFormControl.setValue(Number(Vinobj[0].MODEL_ID));

          this.AbanForm.controls.OtherMakeFormControl.setValue(null);
          this.AbanForm.controls.OtherModelFormControl.setValue(null);
          this.isOtherMakeVisible = false;
          (this.AbanForm.controls['OtherMakeFormControl']).setValidators(null);
          (this.AbanForm.controls['OtherMakeFormControl']).updateValueAndValidity();

          this.isOtherModelVisible = false;
          (this.AbanForm.controls['OtherModelFormControl']).setValidators(null);
          (this.AbanForm.controls['OtherModelFormControl']).updateValueAndValidity();
        }
      },
        error => this.ErrorMsg = <any>error);
  }
  /*****Make */
  resetMake(): void {
    setTimeout(() => {
      (this.AbanForm.controls['MakeFormControl']).setValue(null);
    }, 1);
  }
  filterMakes(val) {
    return val ? this.MakeList.filter(s => s.Description.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.MakeList;
  }
  displayFnMake(Make): string {
    return Make ? Make.Description : Make;
  }
  LoadMake(makeid, modelid) {
    this._dataService.get(Global.DLMS_API_URL + 'api/Make')
      .subscribe(result => {
        if (result != null && result.length > 0) {
          this.MakeList = result;

          this.filteredMakes = this.AbanForm.controls['MakeFormControl'].valueChanges
            .startWith(null)
            .map(Make => Make && typeof Make === 'object' ? Make.Description : Make)
            .map(name => this.filterMakes(name));
        }
        if (makeid > 0) {
          for (let obj of this.MakeList) {
            if (makeid == obj.Make_Id) {
              (<FormControl>this.AbanForm.controls['MakeFormControl'])
                .setValue(obj, {});

              this.filteredModels = this.AbanForm.controls['ModelFormControl'].valueChanges
                .startWith(null)
                .map(Model => Model && typeof Model === 'object' ? Model.Description : Model)
                .map(name => this.filterModels(name));

              if (modelid > 0) {

                for (let obj of this.ModelList) {
                  if (modelid == obj.Model_Id) {
                    (<FormControl>this.AbanForm.controls['ModelFormControl'])
                      .setValue(obj, {});

                  }
                }
              } else {
                this.LoadModel(0);
              }
            }
          }
        }
      },
        error => {
          this.ErrorMsg = <any>error
        });
  }
  changeReason(ev: MatOptionSelectionChange) {
    if (ev.source.selected) {
      this.ReasonDescription=ev.source.value.Description;
    }
  }
  changeMake(ev: MatOptionSelectionChange) {

    if (ev.source.selected) {
      this.LoadModel(ev.source.value.Make_Id);
      let data = this.MakeList.filter((x) => Number(x.Make_Id) == Number(ev.source.value.Make_Id));
      (<FormControl>this.AbanForm.controls['OtherMakeFormControl']).setValue('', {});
      if (data[0].Description == 'OTHER') {
        this.isOtherMakeVisible = true;
        (this.AbanForm.controls['OtherMakeFormControl']).setValidators(Validators.required);
        (this.AbanForm.controls['OtherMakeFormControl']).updateValueAndValidity();
      } else {
        this.isOtherMakeVisible = false;
        (this.AbanForm.controls['OtherMakeFormControl']).setValidators(null);
        (this.AbanForm.controls['OtherMakeFormControl']).updateValueAndValidity();
      }
    }
  }
  /*****Model */
  resetModel(): void {
    setTimeout(() => {
      (this.AbanForm.controls['ModelFormControl']).setValue(null);
    }, 1);
  }
  filterModels(val) {
    return val ? this.ModelList.filter(s => s.Description.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.ModelList;
  }
  displayFnModel(Model): string {
    return Model ? Model.Description : Model;
  }
  LoadModel(MakeId: number) {
    this._dataService.get(Global.DLMS_API_URL + 'api/Model/?MakeId=' + MakeId)
      .subscribe(result => {
        if (result != null && result.length > 0) {
          this.ModelList = result;
          this.filteredModels = this.AbanForm.controls['ModelFormControl'].valueChanges
            .startWith(null)
            .map(Model => Model && typeof Model === 'object' ? Model.Description : Model)
            .map(name => this.filterModels(name));
        }
      },
        error => {
          this.ErrorMsg = <any>error
        });
  }

  changeModel(ev: MatOptionSelectionChange) {
    if (ev.source.selected) {
      let data = this.ModelList.filter((x) => Number(x.Model_Id) == Number(ev.source.value.Model_Id));
      (<FormControl>this.AbanForm.controls['OtherModelFormControl']).setValue('', {});
      if (data[0].Description == 'OTHER') {
        this.isOtherModelVisible = true;
        (this.AbanForm.controls['OtherModelFormControl']).setValidators(Validators.required);
        (this.AbanForm.controls['OtherModelFormControl']).updateValueAndValidity();
      } else {
        this.isOtherModelVisible = false;
        (this.AbanForm.controls['OtherModelFormControl']).setValidators(null);
        (this.AbanForm.controls['OtherModelFormControl']).updateValueAndValidity();
      }
    }
  }
  backtolist() {
    //let url = '/abanlist?UserId=' + this.UserId;
    //this.router.navigateByUrl(url);
    window.top.location.href = Global.PoliceURL + "Aban/AbanList.aspx";


  }
  isValid(Aban_desc, DateString) {
    let Record_Date = new Date(DateString);
    let Forty_Hours = new Date(Record_Date);
    Forty_Hours.setHours(Record_Date.getHours() + Number(Global.ABANWAITHOURS))
    let todaydate = this.CurrentDate;
    var returntype: boolean = false;
    //console.log(ID)
    // console.log(Aban_desc);
    //console.log(Record_Date);
    //console.log(Forty_Hours);
    //console.log(todaydate);
    if (Aban_desc == "Abandoned" && todaydate >= Forty_Hours) {

      returntype = true;
    }
    return returntype;
  }

  LoadCancelReasons(): void {
    this.cancelreasons = [];
    this._dataService.get(Global.DLMS_API_URL + 'api/Aban/GetAbanCancelReasons').subscribe(
      list => {
        if (list) {

          this.cancelreasons = list;
        } else {
          this.cancelreasons = [];
        }
      },
      error => (this.ErrorMsg = <any>error)
    );
  }
  UpdateStatus(AbanId, Status) {
    this.SuccessMsg = "";
    this.ErrorMsg = "";
    var StatusText = "";
    var statusid;
    if (Status == "abandon") {
      statusid = 2;
      StatusText = "confirm";
    } else if (Status == "dispatch") {
      statusid = 3;
      StatusText = "request dispatch for";
    } else if (Status == "undodispatch") {
      statusid = 5;
      StatusText = "revert dispatch";
    } else if (Status == "close") {
      statusid = 4;
      StatusText = "cancel";
    }
    if (confirm("Do you want to " + StatusText + " this Record# " + this.RecordId + " ?")) {
      var updObj = {
        "AbanId": AbanId,
        "StatusId": statusid,
        "UserId": this.UserId,
      };
      this.indLoading = true;
      this._dataService.post(Global.DLMS_API_URL + 'api/Aban/UpdateBAN', updObj)
        .subscribe(response => {
          if (response > 0) {
            this.SuccessMsg = "Record Updated Successfully.";
            if (statusid == 3) {
              this.indLoading = false;
              window.top.location.href = Global.PoliceURL + "Request/Request.aspx?Id=" + response;

            } else {
              this.LoadAbanDetails(AbanId);

            }
          } else {
            this.ErrorMsg = "Record Update Failed. Please try again.";
          }
          this.indLoading = false;
          // this.LoadAbanDetails(AbanId);

        },
          error => {
            this.indLoading = false;
            this.ErrorMsg = <any>error
          });
    }



  }
  OpenConfirmInfo(template: TemplateRef<any>, AbanId, Olid, recordid, StatusId) {
    this.AbanId = AbanId;
    this.ControlID = Olid;
    this.RecordId = recordid;
    this.StatusId = StatusId;

    this.modalConfirmRef = this.modalService.show(template, Object.assign({}, this.config, { class: 'gray modal-md' }));
  }
  closeConfirmRef() {
    this.modalConfirmRef.hide();
  }

  OpenCancelInfo(template: TemplateRef<any>, AbanId, Olid, recordid, StatusId) {
    this.AbanId = AbanId;
    this.ControlID = Olid;
    this.RecordId = recordid;
    this.StatusId = StatusId;

    this.modalCancelRef = this.modalService.show(template, Object.assign({}, this.config, { class: 'gray modal-md' }));
  }
  closeCancelRef() {
    this.modalCancelRef.hide();
  }
  LoadPEOfficers(): void {
    this.PEOfficers = [];
    this._dataService.get(Global.DLMS_API_URL + 'api/Aban/GetPeOfficers').subscribe(
      list => {
        if (list) {
          this.PEOfficers = list;
        } else {
          this.PEOfficers = [];
        }
      },
      error => (this.ErrorMsg = <any>error)
    );
  }
  OpenPEOAssignment(template: TemplateRef<any>, AbanId, Olid, recordid, StatusId) {
    this.AbanId = AbanId;
    this.ControlID = Olid;
    this.RecordId = recordid;
    this.StatusId = StatusId;

    this.modalAssignRef = this.modalService.show(template, Object.assign({}, this.config, { class: 'gray modal-md' }));
  }
  closeAssignRef() {
    this.modalAssignRef.hide();
  }
  
  googleAutoComplete() {
    if (Global.GoogleMapAPIKey != '') {
      // this.blockStreetAddressElementRef.nativeElement.focus();
      this.mapsAPILoader.load().then(() => {

        var polygonCoords = [
          new google.maps.LatLng(42.996468,-87.883187),new google.maps.LatLng (42.992415,-87.878683),new google.maps.LatLng(42.990255, -87.875458),new google.maps.LatLng(42.990159,-87.875314 ),
          new google.maps.LatLng(42.988080,-87.872210),new google.maps.LatLng (42.986074,-87.869215),new google.maps.LatLng(42.978015, -87.857182),new google.maps.LatLng(42.966250,-87.848358 ),new google.maps.LatLng(42.962015,-87.845181 ),
          new google.maps.LatLng(42.958848,-87.844739),new google.maps.LatLng (42.952375,-87.843835),new google.maps.LatLng(42.950519, -87.843575),new google.maps.LatLng(42.944865,-87.842786 ),new google.maps.LatLng(42.944679,-87.842760 ),
          new google.maps.LatLng(42.944116,-87.842681),new google.maps.LatLng (42.930203,-87.843973),new google.maps.LatLng(42.923688, -87.844578),new google.maps.LatLng(42.910317,-87.845820 ),new google.maps.LatLng(42.908090,-87.846027 ),
          new google.maps.LatLng(42.907426,-87.846089),new google.maps.LatLng (42.906779,-87.846149),new google.maps.LatLng(42.900756, -87.846708),new google.maps.LatLng(42.893129,-87.847417 ),new google.maps.LatLng(42.889595,-87.847745 ),
          new google.maps.LatLng(42.889216,-87.847780),new google.maps.LatLng (42.884256,-87.845811),new google.maps.LatLng(42.871953, -87.840927),new google.maps.LatLng(42.856717,-87.834879 ),new google.maps.LatLng(42.849886,-87.831176 ),
          new google.maps.LatLng(42.842222,-87.827021),new google.maps.LatLng (42.842117,-87.843879),new google.maps.LatLng(42.842297, -87.852780),new google.maps.LatLng(42.842435,-87.864704 ),new google.maps.LatLng(42.842666,-87.885584 ),
          new google.maps.LatLng(42.842793,-87.893978),new google.maps.LatLng (42.842814,-87.910370),new google.maps.LatLng(42.842723, -87.914073),new google.maps.LatLng(42.843017,-87.926713 ),new google.maps.LatLng(42.843017,-87.930531 ),
          new google.maps.LatLng(42.843547,-87.951992),new google.maps.LatLng (42.843609,-87.981253),new google.maps.LatLng(42.843609, -87.981852),new google.maps.LatLng(42.843498,-88.030541 ),new google.maps.LatLng(42.843444,-88.040972 ),
          new google.maps.LatLng(42.843394,-88.051261),new google.maps.LatLng (42.843323,-88.069924),new google.maps.LatLng(42.867263, -88.069586),new google.maps.LatLng(42.872879,-88.069586 ),new google.maps.LatLng(42.898257,-88.069560 ),
          new google.maps.LatLng(42.898415,-88.069586),new google.maps.LatLng (42.898493,-88.069587),new google.maps.LatLng(42.900219, -88.069586),new google.maps.LatLng(42.909647,-88.069587 ),new google.maps.LatLng(42.921952,-88.069587 ),
          new google.maps.LatLng(42.923815,-88.069587),new google.maps.LatLng (42.930115,-88.069489),new google.maps.LatLng(42.931986, -88.069689),new google.maps.LatLng(42.944533,-88.069382 ),new google.maps.LatLng(42.951762,-88.069295 ),
          new google.maps.LatLng(42.952627,-88.069288),new google.maps.LatLng (42.957663,-88.069257),new google.maps.LatLng(42.959104, -88.069249),new google.maps.LatLng(42.966390,-88.069099 ),new google.maps.LatLng(42.971109,-88.068878 ),
          new google.maps.LatLng(42.973666,-88.068887),new google.maps.LatLng (42.977800,-88.068731),new google.maps.LatLng(42.979814, -88.068588),new google.maps.LatLng(42.980405,-88.068639 ),new google.maps.LatLng(42.980960,-88.068620 ),
          new google.maps.LatLng(42.988230,-88.068328),new google.maps.LatLng (42.989793,-88.068189),new google.maps.LatLng(42.995487, -88.068034),new google.maps.LatLng(42.996306,-88.068062 ),new google.maps.LatLng(42.999958,-88.067854 ),
          new google.maps.LatLng(43.002817,-88.067739),new google.maps.LatLng (43.007038,-88.067496),new google.maps.LatLng(43.007213, -88.067488),new google.maps.LatLng(43.007817,-88.067488 ),new google.maps.LatLng(43.009414,-88.067695 ),
          new google.maps.LatLng(43.010014,-88.067462),new google.maps.LatLng (43.013013,-88.067488),new google.maps.LatLng(43.016399, -88.067252),new google.maps.LatLng(43.020021,-88.067182 ),new google.maps.LatLng(43.021840,-88.067147 ),
          new google.maps.LatLng(43.029751,-88.066988),new google.maps.LatLng (43.030012,-88.066988),new google.maps.LatLng(43.030412, -88.067088),new google.maps.LatLng(43.030885,-88.066993 ),new google.maps.LatLng(43.036513,-88.066916 ),
          new google.maps.LatLng(43.042240,-88.066936),new google.maps.LatLng (43.045296,-88.066900),new google.maps.LatLng(43.050865, -88.066871),new google.maps.LatLng(43.050946,-88.066893 ),new google.maps.LatLng(43.052680,-88.066861 ),
          new google.maps.LatLng(43.059409,-88.066917),new google.maps.LatLng (43.059865,-88.066925),new google.maps.LatLng(43.059935, -88.066825),new google.maps.LatLng(43.067147,-88.066825 ),new google.maps.LatLng(43.072817,-88.066635 ),
          new google.maps.LatLng(43.073422,-88.066714),new google.maps.LatLng (43.074379,-88.066705),new google.maps.LatLng(43.074463, -88.066608),new google.maps.LatLng(43.088976,-88.066307 ),new google.maps.LatLng(43.090297,-88.066380 ),
          new google.maps.LatLng(43.098409,-88.066143),new google.maps.LatLng (43.104221,-88.066025),new google.maps.LatLng(43.104728, -88.066015),new google.maps.LatLng(43.105955,-88.065982 ),new google.maps.LatLng(43.107931,-88.065918 ),
          new google.maps.LatLng(43.116890,-88.065668),new google.maps.LatLng (43.117366,-88.065621),new google.maps.LatLng(43.119095, -88.065576),new google.maps.LatLng(43.120464,-88.065589 ),new google.maps.LatLng(43.124501,-88.065604 ),
          new google.maps.LatLng(43.125387,-88.065621),new google.maps.LatLng (43.128141,-88.065108),new google.maps.LatLng(43.133544, -88.065085),new google.maps.LatLng(43.141325,-88.064729 ),new google.maps.LatLng(43.147993,-88.064403 ),
          new google.maps.LatLng(43.159753,-88.064409),new google.maps.LatLng (43.162489,-88.064402),new google.maps.LatLng(43.190025, -88.063403),new google.maps.LatLng(43.192117,-88.063353 ),new google.maps.LatLng(43.192487,-88.023724 ),
          new google.maps.LatLng(43.192581,-88.003814),new google.maps.LatLng (43.192550,-87.994288),new google.maps.LatLng(43.192541, -87.983958),new google.maps.LatLng(43.192487,-87.973742 ),new google.maps.LatLng(43.192434,-87.964668 ),
          new google.maps.LatLng(43.192405,-87.959456),new google.maps.LatLng (43.192407,-87.959425),new google.maps.LatLng(43.192264, -87.944300),new google.maps.LatLng(43.192147,-87.924941 ),new google.maps.LatLng(43.192141,-87.924106 ),
          new google.maps.LatLng(43.192106,-87.917997),new google.maps.LatLng (43.192205,-87.914146),new google.maps.LatLng(43.192108, -87.904786),new google.maps.LatLng(43.192196,-87.898941 ),new google.maps.LatLng(43.192090,-87.895007 ),
          new google.maps.LatLng(43.192008,-87.892886),new google.maps.LatLng (43.192019,-87.892648),new google.maps.LatLng(43.192044, -87.892090),new google.maps.LatLng(43.187795,-87.888570 ),new google.maps.LatLng(43.186608,-87.887586 ),
          new google.maps.LatLng(43.183359,-87.886266),new google.maps.LatLng (43.179944,-87.884878),new google.maps.LatLng(43.179929, -87.884872),new google.maps.LatLng(43.179674,-87.884769 ),new google.maps.LatLng(43.170609,-87.881085 ),
          new google.maps.LatLng(43.169798,-87.881500),new google.maps.LatLng (43.160255,-87.886380),new google.maps.LatLng(43.155429, -87.888849),new google.maps.LatLng(43.154493,-87.889327 ),new google.maps.LatLng(43.154400,-87.889375 ),
          new google.maps.LatLng(43.153894,-87.889634),new google.maps.LatLng (43.151108,-87.891059),new google.maps.LatLng(43.148710, -87.892285),new google.maps.LatLng(43.143405,-87.896008 ),new google.maps.LatLng(43.140417,-87.898105 ),
          new google.maps.LatLng(43.139112,-87.899020),new google.maps.LatLng (43.137310,-87.900285),new google.maps.LatLng(43.133357, -87.901345),new google.maps.LatLng(43.133210,-87.901385 ),new google.maps.LatLng(43.133200,-87.901384 ),
          new google.maps.LatLng(43.133002,-87.901359),new google.maps.LatLng (43.126000,-87.900496),new google.maps.LatLng(43.125910, -87.900485),new google.maps.LatLng(43.125874,-87.900463 ),new google.maps.LatLng(43.114011,-87.893185 ),
          new google.maps.LatLng(43.101717,-87.879169),new google.maps.LatLng (43.100617,-87.877915),new google.maps.LatLng(43.099030, -87.876106),new google.maps.LatLng(43.099011,-87.876084 ),new google.maps.LatLng(43.089810,-87.872493 ),
          new google.maps.LatLng(43.089474,-87.872362),new google.maps.LatLng (43.089449,-87.872352),new google.maps.LatLng(43.089199, -87.872255),new google.maps.LatLng(43.088363,-87.871928 ),new google.maps.LatLng(43.084598,-87.870459 ),
          new google.maps.LatLng(43.081938,-87.869421),new google.maps.LatLng (43.074666,-87.866583),new google.maps.LatLng(43.074419, -87.866487),new google.maps.LatLng(43.074412,-87.866484 ),new google.maps.LatLng(43.064412,-87.870184 ),
          new google.maps.LatLng(43.064376,-87.870217),new google.maps.LatLng (43.058516,-87.875460),new google.maps.LatLng(43.057529, -87.876343),new google.maps.LatLng(43.051285,-87.881930 ),new google.maps.LatLng(43.051130,-87.882069 ),
          new google.maps.LatLng(43.051113,-87.882084),new google.maps.LatLng (43.045834,-87.889883),new google.maps.LatLng(43.042497, -87.894813),new google.maps.LatLng(43.042351,-87.895028 ),new google.maps.LatLng(43.042313,-87.895084 ),
          new google.maps.LatLng(43.042152,-87.895127),new google.maps.LatLng (43.040249,-87.895634),new google.maps.LatLng(43.038028, -87.896227),new google.maps.LatLng(43.036637,-87.896598 ),new google.maps.LatLng(43.030689,-87.898184 ),
          new google.maps.LatLng(43.028813,-87.898684),new google.maps.LatLng (43.025167,-87.897871),new google.maps.LatLng(43.020530, -87.896836),new google.maps.LatLng(43.019680,-87.896647 ),new google.maps.LatLng(43.018565,-87.896398 ),
          new google.maps.LatLng(43.017486,-87.896157),new google.maps.LatLng (43.015814,-87.895784),new google.maps.LatLng(43.011521, -87.893511),new google.maps.LatLng(43.008450,-87.891885 ),new google.maps.LatLng(43.003647,-87.889342 ),
          new google.maps.LatLng(43.003181,-87.889095),new google.maps.LatLng (43.002631,-87.888804),new google.maps.LatLng(43.000715, -87.887789),new google.maps.LatLng(43.000552,-87.887703 ),new google.maps.LatLng(43.000514,-87.887683 ),
          new google.maps.LatLng(42.996468,-87.883187) 
          ];
        var cityBounds = new google.maps.LatLngBounds();
          for (var i = 0; i < polygonCoords.length; i++) {
            cityBounds.extend(polygonCoords[i]);
          }
        const autocomplete: any = new google.maps.places.Autocomplete(this.AddressElementRef.nativeElement, {
         // componentRestrictions: { country: 'US' },
          types: ['geocode'],
          bounds: cityBounds, 
          strictBounds: true,        
        });

        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            if (place) {
              let address_list = place.address_components;

              let addressModel: AddressModel = {
                street_number: isNullOrUndefined(address_list.find(x => x.types[0] === "street_number")) ? '' : address_list.find(x => x.types[0] === "street_number").short_name,
                street: isNullOrUndefined(address_list.find(x => x.types[0] === "premises")) ? null : address_list.find(x => x.types[0] === "premises").long_name,
                route: isNullOrUndefined(address_list.find(x => x.types[0] === "route")) ? null : address_list.find(x => x.types[0] === "route").long_name,
                zip: isNullOrUndefined(address_list.find(x => x.types[0] === "postal_code")) ? null : address_list.find(x => x.types[0] === "postal_code").short_name,
                city: isNullOrUndefined(address_list.find(x => x.types[0] === "locality")) ? null : address_list.find(x => x.types[0] === "locality").long_name,
                state: isNullOrUndefined(address_list.find(x => x.types[0] === "administrative_area_level_1")) ? null : address_list.find(x => x.types[0] === "administrative_area_level_1").long_name,
                stateShortName: isNullOrUndefined(address_list.find(x => x.types[0] === "administrative_area_level_1")) ? null : address_list.find(x => x.types[0] === "administrative_area_level_1").short_name,
                logitude: isNullOrUndefined(place.geometry.location.lng()) ? null : place.geometry.location.lng().toString(),
                latitude: isNullOrUndefined(place.geometry.location.lat()) ? null : place.geometry.location.lat().toString(),
                formatted_address: isNullOrUndefined(place) ? null : place.formatted_address,
                notavailablegeometry: null
              };
              (<FormControl>this.AbanForm.controls['AddressFormControl']).setValue(addressModel.street_number + ' ' + addressModel.route, {});
              (this.AbanForm.controls['AddressFormControl']).updateValueAndValidity();

            }
          });
        });

      });
    }
  }

  ChangeLocationType(event) {

    if (event.checked == true) {
      this.IsAlley = false;
      this.IsStreet = false;
      this.IsPrivate = false;
      if (event.source.name == "IsAlley") {
        this.IsAlley = true;
        (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValidators(null);
        (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValidators(null);
        (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValue(this.IsStreet, {});
        (this.AbanForm.controls['IsStreetFormControl']).updateValueAndValidity();
        (<FormControl>this.AbanForm.controls['IsPrivateFormControl']).setValue(this.IsPrivate, {});
        (this.AbanForm.controls['IsPrivateFormControl']).updateValueAndValidity();

      } else if (event.source.name == "IsStreet") {
        this.IsStreet = true;
        (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValidators(null);
        (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValidators(null);
        (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValue(this.IsAlley, {});
        (this.AbanForm.controls['IsAlleyFormControl']).updateValueAndValidity();
        (<FormControl>this.AbanForm.controls['IsPrivateFormControl']).setValue(this.IsPrivate, {});
        (this.AbanForm.controls['IsPrivateFormControl']).updateValueAndValidity();
      } else {
        this.IsPrivate = true;
        (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValue(this.IsStreet, {});
        (this.AbanForm.controls['IsStreetFormControl']).updateValueAndValidity();
        (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValue(this.IsAlley, {});
        (this.AbanForm.controls['IsAlleyFormControl']).updateValueAndValidity();
      }



    } else {
      this.IsAlley = false;
      this.IsStreet = false;
      this.IsPrivate = false;
      (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValue(this.IsStreet, {});
      (<FormControl>this.AbanForm.controls['IsStreetFormControl']).setValidators([Validators.requiredTrue]);
      (this.AbanForm.controls['IsStreetFormControl']).updateValueAndValidity();

      (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValue(this.IsAlley, {});
      (<FormControl>this.AbanForm.controls['IsAlleyFormControl']).setValidators([Validators.requiredTrue]);
      (this.AbanForm.controls['IsAlleyFormControl']).updateValueAndValidity();
      (<FormControl>this.AbanForm.controls['IsPrivateFormControl']).setValue(this.IsPrivate, {});
      (this.AbanForm.controls['IsPrivateFormControl']).updateValueAndValidity();

    }

  }
}
interface AddressModel {
  street_number: string
  street: string
  route: string
  zip: string
  city: string
  state: string
  stateShortName: string
  logitude: string
  latitude: string
  formatted_address: string
  notavailablegeometry: string
}
