import { Component, inject, output, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CommonModule } from '@angular/common';
import { TablerIconComponent } from 'angular-tabler-icons';
import { NoteTemplate } from '../../../core/models/user-metadata';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { UNKNOW_CATEGORY } from '../../../core/data/user-metadata-default.data';

@Component({
  selector: 'app-quick-notes-bar',
  imports: [CommonModule, TablerIconComponent, ButtonModule, TooltipModule, ConfirmPopupModule],
  templateUrl: './quick-note-bar.html',
  styleUrl: './quick-note-bar.css',
  providers: [ConfirmationService],
})
export class QuickNoteBar {
  private deleteBtn = viewChild('deleteBtn');

  private metadataService = inject(UserMetadaService);

  private messageService = inject(MessageService);

  templates = this.metadataService.favoriteNotes;
  categories = this.metadataService.categories;

  onSelect = output<NoteTemplate>();

  async confirmDelete(event: Event, id: string) {
    event.stopPropagation();

    await this.metadataService
      .deleteFavoriteNote(id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Template deleted successfully',
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete template',
        });
      });
  }

  findCategoryIcon(categoryId: string): string {
    const category = this.categories().find((cat) => cat.id === categoryId);
    return category ? category.icon : UNKNOW_CATEGORY.icon;
  }
}
