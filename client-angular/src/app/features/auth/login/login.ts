import { Component, forwardRef, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppStore } from '../../../core/store/AppStore';

@Component({
  selector: 'app-login',
  imports: [forwardRef(() => LoginGoogle)],
  template: `
    <div class="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      <!--   
    <img
        ngSrc="images/minder_bg_note.jpg"
        alt="Background"
        fill
        priority
        class="object-cover object-center z-0"
      />-->
      <div class="absolute inset-0 bg-black/40 z-0 backdrop-blur-[2px]"></div>

      <div
        class="relative z-10 w-full max-w-md p-8 rounded-3xl 
               bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl 
               flex flex-col items-center gap-6 text-center animate-fade-in-up"
      >
        <app-login-google />

        <p class="text-xs  mt-4">
          Continuando accetti i
          <a href="#" class="underline hover:text-primary-300 text-primary-500">Termini</a> e la
          <a href="#" class="underline hover:text-primary-300 text-primary-500">Privacy Policy</a>.
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class Login {}

@Component({
  selector: 'app-login-google',
  imports: [ButtonModule],
  template: `
    <div class="col-span-12 mt-4 text-center">
      <div class="flex gap-4">
        <p-button
          pRipple
          label="Login with Google"
          icon="pi pi-google"
          class="p-button-rounded p-button-primary"
          (click)="appStore.signInGoogle()"
        />
      </div>
    </div>
  `,
})
export class LoginGoogle {
  protected appStore = inject(AppStore);
}
