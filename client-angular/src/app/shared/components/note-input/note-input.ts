import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { SimpleEntry } from '../../../core/models/appwrite';
import { UserCategory, UserTag } from '../../../core/models/user-metadata';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { NoteService } from '../../services/note-service';

export interface CompiledNoteInput {
  content: string;
  category: UserCategory;
  tags: UserTag[];
}

@Component({
  selector: 'app-note-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './note-input.html',
  styleUrl: './note-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteInput {
  userMetadata = inject(UserMetadaService);
  noteService = inject(NoteService);
  messageService = inject(MessageService);
  dateToSetISOFormat = input<string>();

  categories = this.userMetadata.categories;
  tags = this.userMetadata.tags;

  newItemAdded = output<SimpleEntry>();

  noteForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
    selectedCategories: new FormControl<UserCategory[]>([], [Validators.required]),
    selectedTags: new FormControl<UserTag[]>([]),
  });

  async onSubmit() {
    if (this.noteForm.valid) {
      try {
        const newNote = await this.noteService.createNote({
          categoryId: this.getCategoryId(),
          content: this.noteForm.value.content!,
          date: this.dateToSetISOFormat() ?? new Date().toISOString(),
          tagIdList: this.noteForm.value.selectedTags?.map((tag) => tag.id) || [],
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Note created successfully',
        });

        this.newItemAdded.emit(newNote);
        this.noteForm.reset();
      } catch (e) {
        console.error(e);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      }
    }
  }

  getCategoryId() {
    if (!this.noteForm.value.selectedCategories) return 'cat_unknow';

    return this.noteForm.value.selectedCategories.length > 0
      ? this.noteForm.value.selectedCategories[0].id
      : 'cat_unknow';
  }

  reverseSelect = {
    top: 'auto !important',
    bottom: '100% !important',
    'margin-bottom': '5px',
    'transform-origin': 'center bottom',
  };
}
