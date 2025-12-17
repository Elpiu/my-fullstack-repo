import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppStore } from '../../../core/store/AppStore';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex flex-col h-full overflow-y-auto pb-24">
      <div class="p-6 pb-8  shadow-sm bg-surface-800">
        <h1 class="text-2xl font-bold mb-1">Profilo</h1>
        <div class="flex items-center gap-4 mt-4">
          <div
            class="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold border-2 shadow-md"
          >
            {{ userInitial() }}
          </div>

          <div>
            <h2 class="text-lg font-semibold">{{ store.user()?.name }}</h2>
            <p class="text-sm">{{ store.user()?.email }}</p>
          </div>

          <button
            pButton
            icon="pi pi-sign-out"
            class="ml-auto transition-all"
            [rounded]="true"
            label="Logout"
            (click)="store.signOut()"
            aria-label="Logout"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProfilePage implements OnInit {
  store = inject(AppStore);

  userInitial = computed(() => this.store.user()?.name?.charAt(0).toUpperCase());

  ngOnInit() {}
}
