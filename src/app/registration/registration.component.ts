import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { User } from '../models/user';
import { SharedService } from '../services/shared.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  imports: [

    ReactiveFormsModule, CommonModule
  ],
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  dataForm: FormGroup;
  medications: string[] = ['No medications', 'Insulin', 'Tablets'];
  user: User = {
    userId: '1',
    name: '',
    lastName: '',
    dob: new Date(),
    country: '',
    unit: '',
    diabetesType: '',
    medications: ''
  };

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private sharedService: SharedService) {
    this.dataForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      country: ['', Validators.required],
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

