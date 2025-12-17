import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '../../../core/store/AppStore';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppRoutesNavigation } from '../../../app.routes';

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
  protected appStore = inject(AppStore);
  protected router = inject(Router);

  ngOnInit() {
    if (!this.appStore.isLoadingUser()) {
      if (this.appStore.user()) {
        this.router.navigate([AppRoutesNavigation.HOME]);
      } else {
        this.router.navigate([AppRoutesNavigation.LOGIN]);
      }
    }
  }
}
