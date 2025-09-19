import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { User } from '../models/user';
import { SharedService } from '../services/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  imports: [

    ReactiveFormsModule, CommonModule,TranslateModule
  ],
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  dataForm: FormGroup;
  medications: string[] = ['select-option','no-medication', 'insulin', 'tablets'];
  user: User = {
    userId: '1',
    name: '',
    lastName: '',
    dob: new Date(),
    postCode:'',
    city:'',
    country: '',
    unitId: '',
    diabetesType: '',
    medications: '',
    email: '',
    password: '',
    password_repeat: ''
  };

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private sharedService: SharedService) {
    this.dataForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      country: ['', Validators.required],
      postCode:['',''],
      city: ['', Validators.required],
      unit: ['', Validators.required],
      diabetesType: ['', Validators.required],
      medication: ['', Validators.required],
    });
  }
  ngOnInit(): void {

    
    this.sharedService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.dataForm.patchValue(user);
      }
    });
    this.sharedService.loadUser(this.user.userId, false);
  }

  onSubmit(): void {
    if (this.dataForm.invalid) {
      return;
    }

    this.user = this.dataForm.value;
    let cachedUser =  sessionStorage.getItem('cachedUser');
    if (cachedUser) {
      const parsedUser = JSON.parse(cachedUser);
      this.user.userId = parsedUser.userId;
    }
    this.registrationService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        alert("Thank you!!");
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert("Registration failed. Please try again.");
      }
    });
  }
}

