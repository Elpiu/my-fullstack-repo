import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppStore } from '../store/AppStore';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-callback',
  imports: [],
  template: `
    <div class="h-screen flex justify-center items-center">
      <p-progress-spinner
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
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
        this.router.navigate(['/app']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}
