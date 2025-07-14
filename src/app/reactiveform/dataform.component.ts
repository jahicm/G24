// diabetes-form.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Data } from '../models/data';
import { DataService } from '../services/dataservice.service';


@Component({
  selector: 'app-data',
  templateUrl: './dataform.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class DataFormComponent {
  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.dataForm = this.fb.group({
      blutzuckerwert: [null, [Validators.required, Validators.min(1), Validators.max(700)]],
      messzeitpunkt: [new Date().toISOString().substring(0, 16), Validators.required], // datetime-local
      messmethode: ['finger', Validators.required],
      insulinTyp: [''], // optional
      insulinMenge: [null],
      mahlzeitTyp: ['frühstück'],
      kohlenhydrate: [null, Validators.min(0)],
      sportArt: [''],
      sportDauer: [null, Validators.min(0)],
      medikamentName: [''],
      medikamentDosierung: [''],
      symptome: [''],
      symptomeSchweregrad: ['leicht'],
      stimmung: ['gut'],
      notizen: [''],
      einheit: ['mmol/L']
    });
  }

  onSubmit() {
    if (this.dataForm.valid) {
      const einheit = this.dataForm.get('einheit')?.value;
      const blutzucker = this.dataForm.get('blutzuckerwert')?.value;
      console.log('Einheit:', einheit + " Blutzuckerwert:", blutzucker);


      if (
        (einheit === 'mg/dL' && (blutzucker < 20 || blutzucker > 700)) ||
        (einheit === 'mmol/L' && (blutzucker < 1 || blutzucker > 50))
      ) {
        console.log('Form invalid: Blutzuckerwert außerhalb des gültigen Bereichs.');
      } else {
        const data: Data = this.dataForm.value;
        this.saveData(data);
        console.log('Form submitted successfully:', data);
      }
    } else {
      console.log('Form invalid');
    }

  }
  saveData(data: Data) {
    this.dataService.saveData(data).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
      },
      error: (error) => {
        console.error('Error saving data:', error);
      }
    });

  }
}
