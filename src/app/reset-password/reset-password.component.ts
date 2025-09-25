import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';
import { RegistrationService } from '../services/registration.service';
import { SharedService } from '../services/shared.service';



@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {


  dataForm: FormGroup;
  passwordStrength: number = 0;
  isPasswordMatch: boolean = true;
  passwordStrengthMessage: string = '';
  token!: string;

  user: User = {
    userId: '',
    name: '',
    lastName: '',
    dob: new Date(),
    postCode: '',
    city: '',
    country: '',
    unit: '',
    diabetesType: '',
    medication: '',
    email: '',
    password: '',
    password_repeat: ''
  };

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private sharedService: SharedService, private router: Router, private route: ActivatedRoute,) {
    this.dataForm = this.fb.group({
      password: ['', [Validators.required]],
      password_repeat: ['', [Validators.required]]
    });

    console.log('ResetPasswordComponent constructor');
  }
  ngOnInit(): void {
    console.log('ngOnInit running');
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log("Token ngOnInit:", this.token);
    });
  }
  isValid() {
    const pw = this.dataForm.get('password')?.value;
    const pwRepeat = this.dataForm.get('password_repeat')?.value;

    if (pw && pwRepeat && pw !== pwRepeat) {
      this.isPasswordMatch = false;
    } else {
      this.isPasswordMatch = true;
    }
  }
  onSubmit() {

   
    const body = {token: this.token, password: this.dataForm.value.password };
    console.log("Resetting password with body:", body.token+"  "+body.password);
    this.registrationService.resetPassword(body).subscribe({

      next: (response) => {
        alert("Password reset successful. Please log in with your new password.");
        this.router.navigate(['/login']);

      },
      error: (err) => {
        console.error('Password reset, try again:', err);
        alert("Password reset, try again");
      }
    });
  }
  checkStrength(): void {
    console.log("Checking password strength...");
    const password = this.dataForm.get('password')?.value || '';
    let strengthPoints = 0;

    if (password.length >= 8) strengthPoints++;
    if (/[A-Z]/.test(password)) strengthPoints++;
    if (/[a-z]/.test(password)) strengthPoints++;
    if (/[0-9]/.test(password)) strengthPoints++;
    if (/[^A-Za-z0-9]/.test(password)) strengthPoints++; // Sonderzeichen

    this.passwordStrength = (strengthPoints / 5) * 100;

    if (strengthPoints <= 2) {
      this.passwordStrengthMessage = 'Schwach';
    } else if (strengthPoints === 3 || strengthPoints === 4) {
      this.passwordStrengthMessage = 'Mittel';
    } else {
      this.passwordStrengthMessage = 'Stark';
    }
  }
  cancel() {
    this.router.navigate(['/login']);
  }
}
