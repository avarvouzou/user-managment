import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service'
import { transformServerUser } from '../shared/user-helper';
import { PresentationUser, ServerUser } from '../shared/user.interface';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  public user: PresentationUser;
  public editedUser: PresentationUser;

  public userId: string;
  public mode: string = 'view';

  public userForm: FormGroup;
  public appTable: FormGroup;

  constructor(
    private userService: UserService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('id');

    this.userForm = this.formBuilder.group({
      name: '',
      country: '',
      age: null,
      birthday: null,
      avatar: null,
    });
    this.userForm.disable();

    this.appTable = this.formBuilder.group({
      userApps: this.formBuilder.array([])
    });

    if(this.userId == null) {
      // we are in new
      this.mode = 'edit';
      this.userForm.enable();
      return;
    }

    this.userService.getUser(this.userId).subscribe((userResp) => {

      this.user = transformServerUser(userResp.data);
      this.editedUser = {
        ...this.user,
        apps: this.user.apps.map(app => ({...app}))
      };

      this.userForm.setValue({
        name: this.user.name,
        country: this.user.country,
        age: this.user.age,
        birthday: (new Date(userResp.data.birthday)).toISOString().split('T')[0],
        avatar: null,
      });

      this.editedUser.apps.forEach(
        (app) => (this.appTable.get('userApps') as FormArray).push(this.formBuilder.group({
          id: app._id,
          existingIcon: [app.avatar],
          newIcon: [null],
          name: [app.name],
          isEditable: [false],
          isNew: [false],
        }))
      );
    })

  }

  getFormControls() {
    const control = this.appTable.get('userApps') as FormArray;
    return control;
  }

  createUser() {
    const userDetails = this.userForm.value;
    const userApps = (this.appTable.get('userApps') as FormArray).value;

    this.userService.createUser(userDetails, userApps).subscribe((resp) => {
      console.log(resp);
      this.router.navigate(['/']);
    });
  }

  editUser() {
    this.mode = 'edit';
    this.userForm.enable();
  }

  updateUser() {
    this.editedUser.name = this.userForm.get('name').value;
    this.editedUser.country = this.userForm.get('country').value;
    this.editedUser.birthday = this.userForm.get('birthday').value;
    this.editedUser.avatar = this.userForm.get('avatar').value;
    this.mode = 'view';
    this.userForm.disable();

    this.userService.editUser(this.userId, this.editedUser).subscribe((userResp) => {
      console.log(userResp);
      window.location.reload();
    });
  }

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe((resp) => {
      console.log(resp);
      this._location.back();
    });
  }

  createNewAppRow() {
    (this.appTable.get('userApps') as FormArray).insert(0, this.formBuilder.group({
      id: null,
      existingIcon: [null],
      newIcon: [null],
      name: [null],
      isEditable: [true],
      isNew: [true],
    }));
  }

  createNewApp(group: FormGroup) {
    this.appService.addApp(this.userId, {
      app: group.get('name').value,
      icon: group.get('newIcon').value,
    }).subscribe((resp) => {
      console.log(resp);
    });
  }

  editAppRow(group: FormGroup) {
    group.patchValue({ isEditable: true });
  }

  onAppAvatarChange($event, group: FormGroup) {
    group.patchValue({
      newIcon: $event.target.files[0]
    })
    group.get('newIcon').markAsDirty();
  }

  onUserAvatarChange($event) {
    this.userForm.patchValue({
      avatar: $event.target.files[0],
    });
    this.userForm.get('avatar').markAsDirty();
  }

  updateApp(group: FormGroup) {
    // Get all dirty fields by transforming group controls from object to array and back.
    // This will be needed when we save the changes to history.
    // const dirtyFields = Object.entries(group.controls)
    //   .filter(pair => pair[1].dirty)
    //   .reduce((acc, pair) => ({ ...acc, [pair[0]]: pair[1].value }), {});

    this.appService.updateApp(this.userId, group.get('id').value, group.value).subscribe((resp) => {
      console.log(resp);
    });
    group.patchValue({ isEditable: false });
  }

  deleteApp(group: FormGroup, idx: number) {
    this.appService.deleteApp(this.userId, group.get('id').value).subscribe((resp) => {
      (this.appTable.get('userApps') as FormArray).removeAt(idx);
    });
  }

}
