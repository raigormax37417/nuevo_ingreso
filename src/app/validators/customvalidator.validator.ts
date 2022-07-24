import { FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";

export function customLengthValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== null && (isNaN(control.value) || control.value < min || control.value > max)) {
            return { 'lengthLimit': true };
        }
        return null;
    };
}
