import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ID } from 'appwrite';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserCategory } from '../../../core/models/user-metadata';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ICON_LIST, TAILWIND_PALETTE } from '../../../core/utils/tailwindcss.palette';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-category-creator',
  imports: [
    CommonModule,
    FormsModule,
    InputGroupAddonModule,
    TablerIconComponent,
    InputTextModule,
    ButtonModule,
    TablerIconComponent,
    InputGroup,
  ],
  templateUrl: './category-creator.html',
  styles: `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCreator {
  onCreate = output<UserCategory>();

  label = signal('');
  selectedIcon = signal('tag');
  selectedColor = signal({ name: 'blue', shade: '500' });
  icons = ICON_LIST;

  shades = ['300', '400', '600', '800', '950'] as const;
  numberOfShades = this.shades.length;

  colorFamilies = TAILWIND_PALETTE;

  canCreate = computed(() => {
    return this.selectedColor() && this.selectedIcon() && this.label();
  });

  create() {
    if (!this.label()) return;

    const newCat: UserCategory = {
      id: ID.unique(),
      label: this.label(),
      icon: this.selectedIcon(),
      // Es: "blue-500"
      color: `${this.selectedColor().name}-${this.selectedColor().shade}`,
    };

    this.onCreate.emit(newCat);

    // Reset
    this.label.set('');
    this.selectedIcon.set('tag');
    this.selectedColor.set({ name: 'blue', shade: '600' });
  }
}
