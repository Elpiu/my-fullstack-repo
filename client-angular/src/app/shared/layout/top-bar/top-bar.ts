import { Component, inject, signal } from '@angular/core';
import { AppStore } from '../../../core/store/AppStore';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-top-bar',
  imports: [],
  template: `
    <header class="w-full  shadow-md z-40  px-3 py-3">
      <div class="flex justify-between items-center w-full">
        <div class="font-bold text-2xl tracking-tight">
          <span>My</span>
          <span class="text-primary-500">{{ appName() }}</span>
        </div>

        <div class="flex items-center gap-2">
          @for (item of buttons; track $index) {
          <button
            (click)="item.handlerClick()"
            class="p-2 rounded-full text-gray-600 hover:bg-surface-300 hover:text-black transition-colors active:scale-95"
            [aria-label]="item.label"
          >
            <i class="text-xl" [classList]="item.icon"></i>
          </button>
          }
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class TopBar {
  appStore = inject(AppStore);
  readonly appName = signal(
    `${environment.appwriteProjectName}-${environment.production ? 'prod' : 'dev'}-${
      environment.appVersion
    }`
  );
  readonly isVisible = signal(true);

  buttons = [
    {
      label: 'Page1',
      url: '/app/page1',
      icon: 'pi pi-user',
      visible: true,
      handlerClick: () => {
        console.log('handlerClick Page1');
      },
    },
    {
      label: 'Page2',
      url: '/app/page2',
      icon: 'pi pi-user',
      visible: true,
      handlerClick: () => {
        console.log('handlerClick Page2');
      },
    },
    {
      label: 'Page3',
      url: '/app/page3',
      icon: 'pi pi-user',
      visible: true,
      handlerClick: () => {
        console.log('handlerClick Page3');
      },
    },
  ];
}
