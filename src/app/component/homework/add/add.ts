import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HomeworkService } from '../../../providers/homework.service';
import { Location } from '@angular/common';
import { CommonService } from '../../../providers/common.service';
import { Router } from '@angular/router'

declare let $: any;

@Component({
  selector: 'homework-add',
  templateUrl: './add.html',
  // styleUrls:['../homework.component.css']

})

export class HomeworkAddComponent implements OnInit {

  public title: string = "New Homework";
  public homework: FormGroup;
  public submitProgress: boolean = false;
  standards: any = [];
  subjects: any = [];
  public emptySubjects: boolean = true;
  public loader: boolean = false;


  constructor(private homeworkService: HomeworkService,
    private commonService: CommonService,
    private _location: Location,
    public router: Router) {        
      
 }


  ngOnInit() {
    this.initForm();
    this.getStandards();
  }
  file: any;

  getFile(event: any) {
    var blob = event.srcElement.files[0];

    if (blob.type == "image/png" || blob.type == "image/jpeg" || blob.type == "image/jpg") {
      this.file = event.srcElement.files[0];
    }
    else {
      $('#errorModal').modal('show');
      this.homework.controls['file'].reset();
     
      // this.homework.controls.file.markAsPristine();
      //   this.homework.controls.file.reset();
    }
  }

  onDueDate(e: any) {
    if (new Date(e.target.value) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
      alert("Please choose an upcoming date from the calendar.");
      this.homework.controls['dueDate'].patchValue(this.commonService.getTomorrow());
    }
  }

  public initForm() {
    this.homework = new FormGroup({
      description: new FormControl('', [Validators.required]),
      standardId: new FormControl('', [Validators.required]),
      subjectId: new FormControl('', [Validators.required]),
      dueDate: new FormControl(this.commonService.getTomorrow(), [Validators.required]),
      file: new FormControl('')
    });
  }

  getSubjects(a: any) {
    this.loader = true;
    this.subjects = [];
    this.homework.controls["subjectId"].reset();
    this.homeworkService.getSubjects(a).subscribe(res => {
      if (res.status == 204) {
        this.emptySubjects = true;
        this.subjects = [];
        this.loader = false;
        return;
      }
      this.emptySubjects = false;
      this.subjects = res;
      this.loader = false;
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
  }

  // public getStandards() {
  //   this.loader = true;
  //   this.standards = this.commonService.getData("standards");
  //   if (typeof (this.standards) === 'undefined') {
  //     this._getStandards();
  //   }
  //   this.loader = false;
  // }

  public getStandards() {
    this.loader = true;
    this.homeworkService.getStandards().subscribe((res) => {
      this.standards = res;
      this.commonService.storeData("standards", res);
      this.loader = false;
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
  }

  submitHomework() {
    this.submitProgress = true;
    let formData = new FormData();
    formData.append('description', this.homework.value['description']);
    formData.append('standardId', this.homework.value['standardId']);
    formData.append('subjectId', this.homework.value['subjectId']);
    formData.append('dueDate', this.homework.value['dueDate']);
    formData.append('file', this.file);
    this.saveHomework(formData);
    this.submitProgress = false;
  }

  // public presentActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Are you sure you want to submit?',
  //     buttons: [{
  //       text: 'YES',
  //       role: 'submit',
  //       handler: () => {
  //         this.saveHomework();
  //       }
  //     }, {
  //       text: 'CANCEL',
  //       role: 'cancel',
  //       handler: () => {
  //         console.log('Cancel clicked');
  //       }
  //     }]
  //   });
  //   actionSheet.present();
  // }

  public saveHomework(formData: any) {
    // console.log(formData);
    // console.log("file", this.file);
    this.loader = true;
    this.homeworkService.PostHomework(formData).subscribe((data) => {
      this.initForm();
      this.loader = false;
      $('#homeworkModal').modal('show');
    }, (err) => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
    this.file=null;
  }

}