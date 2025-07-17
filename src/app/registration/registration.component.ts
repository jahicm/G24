import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { User } from '../models/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  imports: [

    ReactiveFormsModule, CommonModule
  ],
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  dataForm: FormGroup;
  medications: string[] = ['No medications', 'Insulin', 'Tablets'];
  user: User = {
    userId: '',
    name: '',
    lastName: '',
    dob: new Date(),
    country: '',
    unit: '',
    diabetesType: '',
    medications: ''
  };

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) {
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

  onSubmit() {
    if (this.dataForm.valid) {

      this.user = this.dataForm.value;
      this.registrationService.registerUser(this.user).subscribe({
        next: (response) => console.log('User registered:', response),
        error: (err) => console.error('Registration failed:', err)
      });
    }
  }
}
