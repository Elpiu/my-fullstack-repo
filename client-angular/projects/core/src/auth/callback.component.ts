import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthStore } from './auth.store';
import { AppRoutesNavigation } from '../data';

@Component({
  selector: 'app-callback',
  imports: [ProgressSpinnerModule],
  template: `
    <div class="h-screen flex justify-center items-center">
      <p-progress-spinner
        strokeWidth="4"
        fill="transparent"
        animationDuration=".8s"
        [style]="{ width: '5rem', height: '5rem' }"
      />
    </div>
  `,
  styles: ``,
})
export class Callback implements OnInit {
  protected authStore = inject(AuthStore);
  protected router = inject(Router);

  ngOnInit() {
    if (!this.authStore.isLoading()) {
      const target = this.authStore.isLoggedIn()
        ? AppRoutesNavigation.HOME
        : AppRoutesNavigation.LOGIN;
      this.router.navigate([target]);
    }
  }
}
