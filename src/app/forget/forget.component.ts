import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forget',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.css'
})
export class ForgetComponent {

  dataForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.dataForm = this.fb.group({
      email: ['', Validators.email]
    });
  }
   onSubmit(): void {
    if (this.dataForm.invalid) {
      return;
    }

    const email = this.dataForm.value.email;
    console.log('Password reset request for:', email);

    // hier kannst du Service aufrufen
    // this.authService.resetPassword(email).subscribe(...)
  }
}
