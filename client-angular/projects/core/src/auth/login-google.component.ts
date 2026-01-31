import { Component, inject } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from './auth.store';

@Component({
  selector: 'app-login-google',
  imports: [ButtonModule, TablerIconComponent],
  template: `
    <div class="col-span-12 mt-4 text-center">
      <div class="flex gap-4">
        <p-button
          pRipple
          label="Login with Google"
          class="p-button-rounded p-button-primary"
          (click)="authStore.signInGoogle()"
        >
          <tabler-icon name="brand-google" />
        </p-button>
      </div>
    </div>
  `,
})
export class LoginGoogle {
  protected readonly authStore = inject(AuthStore);
}
