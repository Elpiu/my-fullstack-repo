import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { TablerIconComponent } from 'angular-tabler-icons';
import { IconBadge } from 'angular-tabler-icons/icons';
import { BadgeModule } from 'primeng/badge';
import { UiDialog } from 'ui-kit';
import { AppStore } from '../../core/store/AppStore';
import { MockDataService } from '../../core/services/mock-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-menu',
  imports: [Menu, ButtonModule, TablerIconComponent, BadgeModule, UiDialog],
  template: `
    <div class="card flex justify-center">
      <p-menu #menu [model]="items" [popup]="true">
        <ng-template #item let-item>
          <a pRipple class="flex items-center px-3 py-2 cursor-pointer" [class]="item.linkClass">
            <tabler-icon [name]="item.icon"></tabler-icon>
            <span class="ms-2">{{ item.label }}</span>
          </a>
        </ng-template>
      </p-menu>
      <p-button (click)="menu.toggle($event)">
        <tabler-icon name="user"></tabler-icon>
      </p-button>
    </div>

    <uikit-dialog [(visible)]="showLogoutDialog" header="Confirm logout">
      <div class="py-4 text-center">
        <tabler-icon name="logout" size="48" class="text-red-500 mb-3"></tabler-icon>
        <p>Are you sure you want to logout?</p>
      </div>

      <div footer class="flex justify-end gap-3 w-full">
        <p-button
          label="Back"
          [text]="true"
          severity="secondary"
          (click)="showLogoutDialog.set(false)"
        />
        <p-button label="Exit" severity="danger" (click)="handleLogout()" />
      </div>
    </uikit-dialog>
  `,
})
export class ProfileMenu implements OnInit {
  items: MenuItem[] | undefined;

  showLogoutDialog = signal(false);

  appStore = inject(AppStore);
  mockDataService = inject(MockDataService);

  ngOnInit() {
    this.items = [
      {
        label: 'Account',
        items: [
          {
            label: 'Logout',
            icon: 'logout',
            command: () => {
              this.showLogoutDialog.set(true);
            },
          },
        ],
      },
    ];
    if (!environment.production && this.items[0]) {
      let item = this.items[0].items;

      item!.push({
        label: 'Trigger Mock Data',
        icon: 'database',
        command: () => {
          this.mockDataService.generateMockNotes(30);
        },
      });
    }
  }

  handleLogout() {
    this.showLogoutDialog.set(false);
    this.appStore.signOut();
  }
}
