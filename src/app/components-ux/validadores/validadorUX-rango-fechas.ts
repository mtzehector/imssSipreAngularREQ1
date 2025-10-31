import { FormGroup, ValidationErrors, ValidatorFn ,AbstractControl } from '@angular/forms';

 

  export function validadorUXRangoFechas(fechaInicio: string, fechaFin: string) {
    return (formGroup: FormGroup) => {
        const fechaInicioF = formGroup.controls[fechaInicio];
        const fechaFinF = formGroup.controls[fechaFin];
        var fechaInicio_aux = fechaInicioF.value.split("/");
        var fechaFin_aux = fechaFinF.value.split("/");
        if (fechaFinF.errors && !fechaFinF.errors.fechaMayorError) {
           return;
      }



var fecha1 = new Date(parseInt(fechaInicio_aux[1])-1,parseInt(fechaInicio_aux[0]),parseInt(fechaInicio_aux[2]));
var fecha2 = new Date(parseInt(fechaFin_aux[1])-1,parseInt(fechaFin_aux[0]),parseInt(fechaFin_aux[2]));
       // set error on matchingControl if validation fails
        if (fecha1 > fecha2) {
         
          fechaFinF.setErrors({ fechaMayorError: true });
        } else {
          fechaFinF.setErrors(null);
          fechaFinF.setErrors({ fechaMayorError: false });
        }
    }
}