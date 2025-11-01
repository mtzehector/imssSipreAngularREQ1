import { FormGroup, ValidationErrors, ValidatorFn ,AbstractControl } from '@angular/forms';

 

  export function validadorFechaActual(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        var fecha: string = control.value;
        var fecha_aux = fecha.split("-");
        var fecha1 = new Date(parseInt(fecha_aux[0]),parseInt(fecha_aux[1])-1,parseInt(fecha_aux[2]));
        var hoy = new Date();
        if (fecha1>hoy) {
            return null;
        } else {
      
        return { 'fechaMayorE': {value: control.value} };
      }
    };
  }
