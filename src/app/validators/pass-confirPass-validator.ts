import { FormGroup } from '@angular/forms';

export class PassAndConfirmPassValidator {
  static checkPasswords(group: FormGroup) {
    if (group) {
      let pass = group.get('password').value;
      let confirmPass = group.get('confirmPassword').value;
      if (group.get('confirmPassword').dirty) {
        return pass === confirmPass ? null : { notSame: true };
      } else {
        return null;
      }
    }
  }
}
