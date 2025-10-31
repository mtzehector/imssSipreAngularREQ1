import { FormGroup } from '@angular/forms';

export function CoincidirCadenas(controlName: string, matchingControlName: string) {
   
    return (formGroup: FormGroup) => {
        console.log("Validar 1");
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            console.log("Validar 2");
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            console.log("Validar 3");
            matchingControl.setErrors({ mustMatch: true });
        } else {
            console.log("Validar 4");
            matchingControl.setErrors(null);
        }
    }
}