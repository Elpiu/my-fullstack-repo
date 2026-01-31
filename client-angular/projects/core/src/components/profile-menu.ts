import { Component, OnInit, signal, inject } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../auth/auth.store';
import { UiDialog } from 'ui-kit';
import { Menu } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ActivatedRoute, Router } from '@angular/router';

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
  authStore = inject(AuthStore);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.items = [
      {
        label: 'Account',
        items: [
          {
            label: 'Profile',
            icon: 'user',
            command: () => {
              this.router.navigate(['profile'], { relativeTo: this.route });
            },
          },
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
  }

  handleLogout() {
    this.showLogoutDialog.set(false);
    this.authStore.signOut();
  }
}
