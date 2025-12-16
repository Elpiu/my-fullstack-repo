import { Component } from '@angular/core';
import { TopBar } from '../top-bar/top-bar';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-main-layout',
  imports: [TopBar, RouterOutlet, Toast],
  template: `
    <div class="flex flex-col h-screen font-sans">
      <app-top-bar />
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>

      <p-toast position="bottom-right" />
    </div>
  `,
  styles: ``,
})
export class MainLayout {}
