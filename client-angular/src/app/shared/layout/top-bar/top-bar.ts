import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { APP_DATA } from '../../../../../projects/core/src/data';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  imports: [ButtonDirective, ButtonModule, TablerIconComponent, RouterModule, NgComponentOutlet],

  template: `
    <header class="w-full  shadow-md z-40  px-3 py-3">
      <div class="flex justify-between items-center w-full">
        <div class="font-bold text-2xl tracking-tight">
          <span>My</span>
          <span class="text-primary-500">{{ appName() }}</span>
        </div>

        <div class="flex items-center gap-2">
          @for (item of APP_DATA.topbarItems; track $index) {
            @if (item.visible) {
              <div class="topbar-item">
                @if (item.component) {
                  <ng-container *ngComponentOutlet="item.component" />
                } @else {
                  <button
                    (click)="item.handlerClick?.(router, route)"
                    pButton
                    class="p-2 rounded-full text-gray-600 hover:bg-surface-300 hover:text-black transition-colors active:scale-95"
                    [aria-label]="item.label"
                  >
                    <i-tabler [name]="item.icon!"></i-tabler>
                  </button>
                }
              </div>
            }
          }
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class TopBar {
  APP_DATA = APP_DATA;

  router = inject(Router);
  route = inject(ActivatedRoute);

  readonly appName = signal(
    `${environment.appwriteProjectName}-${environment.production ? 'prod' : 'dev'}-${
      environment.appVersion
    }`,
  );
  readonly isVisible = signal(true);
}
