import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TagCreator } from '../../shared/components/tag-creator/tag-creator';
import { CategoryCreator } from '../../shared/components/category-creator/category-creator';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UserCategory, UserTag } from '../../core/models/user-metadata';
import { UserMetadaService } from '../../core/services/user-metada-service';
import { AppStore } from '../../core/store/AppStore';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  AccordionModule,
  AccordionPanel,
  Accordion,
  AccordionContent,
  AccordionHeader,
} from 'primeng/accordion';

@Component({
  selector: 'app-settings-page',
  imports: [
    TagCreator,
    CategoryCreator,
    ButtonModule,
    CommonModule,
    TablerIconComponent,
    ConfirmPopupModule,
    AccordionPanel,
    Accordion,
    AccordionContent,
    AccordionHeader,
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css',
})
export class SettingsPage implements OnInit {
  //opacity-0 group-hover:opacity-100 transition-opacity
  store = inject(AppStore);
  metadata = inject(UserMetadaService);

  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  userInitial = computed(() => this.store.user()?.name?.charAt(0).toUpperCase());

  accordingCreateCategoryVisible = signal(false);
  accordingCreateTagVisible = signal(false);

  confirmDeleteCategory(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure?',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        outlined: true,
      },
      accept: () => {
        this.deleteCategory(id);
      },
      reject: () => {},
    });
  }

  ngOnInit() {
    const userId = this.store.userId();
    if (userId) {
      this.metadata.loadUserMetadata(userId);
    }
  }

  addCategory(cat: UserCategory) {
    this.metadata.addCategory(cat);
  }

  deleteCategory(id: string) {
    // Qui potresti aggiungere un confirmDialog
    this.metadata.deleteCategory(id);
  }

  addTag(tag: UserTag) {
    this.metadata.addTag(tag);
  }

  deleteTag(id: string) {
    this.metadata.deleteTag(id);
  }

  confirmDeleteTag(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure?',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        outlined: true,
      },
      accept: () => {
        this.deleteTag(id);
      },
      reject: () => {},
    });
  }
}
