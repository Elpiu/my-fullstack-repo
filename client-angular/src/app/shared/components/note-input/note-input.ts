import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { SimpleEntry } from '../../../core/models/appwrite';
import { NoteTemplate, UserCategory, UserTag } from '../../../core/models/user-metadata';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { NoteService } from '../../services/note-service';
import { TablerIconComponent } from 'angular-tabler-icons';

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
    TablerIconComponent,
  ],
  templateUrl: './note-input.html',
  styleUrl: './note-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteInput {
  // Services
  private userMetadata = inject(UserMetadaService);
  private noteService = inject(NoteService);
  private messageService = inject(MessageService);

  // Inputs
  dateToSetISOFormat = input<string>();

  noteToEdit = input<SimpleEntry | null>(null);

  saveComplete = output<SimpleEntry>();

  // Signals dati
  categories = this.userMetadata.categories;
  tags = this.userMetadata.tags;
  saveAsTemplate = output<Omit<NoteTemplate, 'id'>>();

  // UI State derivato
  isEditMode = signal(false);

  noteForm = new FormGroup({
    content: new FormControl(''),
    // PrimeNG MultiSelect lavora con array di oggetti
    selectedCategories: new FormControl<UserCategory[]>([], [Validators.required]),
    selectedTags: new FormControl<UserTag[]>([]),
  });

  constructor() {
    // EFFECT: Popola il form quando cambia noteToEdit
    effect(() => {
      const entry = this.noteToEdit();

      if (entry) {
        this.isEditMode.set(true);
        this.patchFormWithEntry(entry);
      } else {
        this.isEditMode.set(false);
        this.noteForm.reset();
      }
    });
  }

  // Helper per convertire IDs salvati in Oggetti per il Form
  private patchFormWithEntry(entry: SimpleEntry) {
    // 1. Trova l'oggetto Categoria completo dall'ID
    const foundCat = this.categories().find((c) => c.id === entry.categoryId);
    const catValue = foundCat ? [foundCat] : [];

    // 2. Trova gli oggetti Tag completi dagli ID
    const foundTags = this.tags().filter((t) => entry.tagIdList?.includes(t.id));

    this.noteForm.patchValue({
      content: entry.content,
      selectedCategories: catValue,
      selectedTags: foundTags,
    });
  }

  async onSubmit() {
    if (this.noteForm.invalid) return;

    const formVal = this.noteForm.value;
    const entryId = this.noteToEdit()?.$id;

    // Preparazione Payload
    const payload = {
      categoryId: this.getCategoryId(),
      content: formVal.content!,
      tagIdList: formVal.selectedTags?.map((tag) => tag.id) || [],
      // Se è edit manteniamo la data originale, se è new usiamo quella passata o oggi
      date: entryId
        ? this.noteToEdit()!.date
        : this.dateToSetISOFormat() ?? new Date().toISOString(),
    };

    await this.saveProcess(payload, entryId);
  }

  private async saveProcess(payload: any, entryId?: string) {
    try {
      let result: SimpleEntry;

      if (this.isEditMode() && entryId) {
        // --- LOGICA UPDATE ---
        result = await this.noteService.updateNote(entryId, payload);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Note updated successfully',
        });
      } else {
        // --- LOGICA CREATE ---
        result = await this.noteService.createNote(payload);
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Note created successfully',
        });
      }

      this.saveComplete.emit(result);

      // Reset solo se siamo in modalità aggiunta continua, altrimenti il padre chiuderà il dialog
      if (!this.isEditMode()) {
        this.noteForm.reset();
      }
    } catch (e) {
      console.error(e);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed' });
    }
  }

  saveAsTemplateClick() {
    const formVal = this.noteForm.value;
    this.saveAsTemplate.emit({
      label: formVal.content || '',
      categoryId: this.getCategoryId(),
      tagIdList: formVal.selectedTags?.map((tag) => tag.id) || [],
    });
  }

  getCategoryId() {
    const cats = this.noteForm.value.selectedCategories;
    if (!cats || cats.length === 0) return 'cat_unknow';
    return cats[0].id;
  }
}
