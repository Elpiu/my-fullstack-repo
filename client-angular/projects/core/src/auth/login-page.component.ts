import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { NgOptimizedImage } from '@angular/common';
import { LoginGoogle } from './login-google.component';
import { APP_DATA, AppRoutesNavigation } from '../data';

@Component({
  selector: 'app-login',
  imports: [LoginGoogle, ButtonModule, NgOptimizedImage],
  template: `
    <div class="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      @let bgImg = APP_DATA.loginBgImg;
      @if (bgImg) {
        <img
          [ngSrc]="bgImg"
          alt="Background"
          fill
          priority
          class="object-cover object-center z-0"
        />
      }

      <div class="absolute inset-0 bg-black/40 z-0 backdrop-blur-[2px]"></div>

      <div
        class="relative z-10 w-full max-w-md p-8 rounded-3xl 
               bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl 
               flex flex-col items-center gap-6 text-center animate-fade-in-up"
      >
        <div>
          <h2 class="text-3xl font-bold">{{ APP_DATA.appName }}</h2>
          <br />
          <p>
            {{ APP_DATA.loginText }}
          </p>
        </div>

        <app-login-google />

        <p class="text-xs  mt-4">
          Continuando accetti i
          <a
            [href]="AppRoutesNavigation.PAGE_TERMS"
            class="underline hover:text-primary-300 text-primary-500"
            >Termini</a
          >
          e la
          <a
            [href]="AppRoutesNavigation.PAGE_PRIVACY"
            class="underline hover:text-primary-300 text-primary-500"
            >Privacy Policy</a
          >.
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class Login {
  APP_DATA = APP_DATA;
  AppRoutesNavigation = AppRoutesNavigation;
}
