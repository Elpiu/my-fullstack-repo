import { Component, inject, input, output } from '@angular/core';
import { UNKNOW_CATEGORY } from '../../../core/data/user-metadata-default.data';
import { SimpleEntry } from '../../../core/models/appwrite';
import { UserCategory } from '../../../core/models/user-metadata';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { TablerIconComponent } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-note-item',
  imports: [CommonModule, TablerIconComponent, ConfirmPopupModule, ButtonModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmpopup />
    @let category = getCategoryById(item().categoryId);

    <div
      class="
        relative overflow-hidden
        rounded-xl p-4 
        bg-surface-card 
        border border-surface 
        shadow-sm 
        transition-all duration-200
        hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700
        group
      "
    >
      <!-- HEADER: Categoria + Actions -->
      <div class="flex justify-between items-start mb-3 h-7">
        <!-- Badge Categoria -->
        <div
          class="flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-semibold "
          [style.background-color]="'var(--p-' + category.color + ')'"
        >
          <tabler-icon [name]="category.icon" class="w-4 h-4"></tabler-icon>
          <span class="">{{ category.label }}</span>
        </div>

        <!-- ACTION BUTTONS: Visibili on hover/focus -->
        <!-- opacity-0 group-hover:opacity-100 rende l'UI pulita quando non interagisci -->
        <div
          class="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
        >
          <!-- EDIT BUTTON -->
          <p-button
            icon="pi pi-pencil"
            [rounded]="true"
            [text]="true"
            severity="secondary"
            size="small"
            styleClass="!w-10 !h-10"
            (onClick)="onEdit.emit(item())"
            pTooltip="Modifica"
            tooltipPosition="top"
          >
            <tabler-icon name="pencil"></tabler-icon>
          </p-button>

          <!-- DELETE BUTTON -->
          <p-button
            icon="pi pi-trash"
            [rounded]="true"
            [text]="true"
            severity="danger"
            size="small"
            styleClass="!w-10 !h-10"
            (onClick)="confirmDelete($event, item().$id)"
            pTooltip="Elimina"
            tooltipPosition="top"
          >
            <tabler-icon name="trash"></tabler-icon>
          </p-button>
        </div>
      </div>

      <!-- CONTENT -->
      <p class="text-color text-sm leading-relaxed whitespace-pre-wrap break-words">
        {{ item().content }}
      </p>

      <!-- FOOTER: Tags -->
      @if(item().tagIdList?.length) {
      <div class="mt-4 flex flex-wrap gap-2 pt-3 border-t border-surface">
        @for(tagId of item().tagIdList; track $index) {
        <span
          class="text-xs text-color-secondary bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md"
        >
          #{{ getTagLabel(tagId) }}
        </span>
        }
      </div>
      }
    </div>
  `,
})
export class NoteItem {
  item = input.required<SimpleEntry>();

  onDelete = output<string>();
  onEdit = output<SimpleEntry>();

  userMetadata = inject(UserMetadaService);
  confirmationService = inject(ConfirmationService);

  categories = this.userMetadata.mapCategories;
  tags = this.userMetadata.mapTags;

  getCategoryById(categoryId: string): UserCategory {
    return this.categories()[categoryId] ?? UNKNOW_CATEGORY;
  }

  getTagLabel(tagId: string): string {
    return this.tags()[tagId]?.label ?? 'N/A';
  }

  confirmDelete(event: Event, id: string) {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Back',
        severity: 'secondary',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        size: 'small',
      },
      accept: () => {
        this.onDelete.emit(id);
      },
    });
  }
}
