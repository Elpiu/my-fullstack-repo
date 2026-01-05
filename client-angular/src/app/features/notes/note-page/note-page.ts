import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Models } from 'appwrite';
import { ButtonModule } from 'primeng/button';
import { SimpleEntry } from '../../../core/models/appwrite';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { UiDialog } from '../../../shared/components/ui-dialog/ui-dialog';
import { NoteService } from '../../../shared/services/note-service';
import { PopoverModule } from 'primeng/popover';
import { JournalComponent } from '../../../shared/components/journal/journal';
import { NoteInput } from '../../../shared/components/note-input/note-input';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-note-page',
  imports: [
    CommonModule,
    JournalComponent,
    ButtonModule,
    DatePipe,
    NoteInput,
    PopoverModule,
    FormsModule,
    DatePickerModule,
    UiDialog,
    TablerIconComponent,
  ],
  templateUrl: './note-page.html',
  styleUrl: './note-page.css',
})
export class NotePage implements OnInit {
  private noteService = inject(NoteService);
  public metadataService = inject(UserMetadaService);

  selectedDate = signal<Date | null>(null);
  allEntries = signal<SimpleEntry[]>([]);
  isLoading = signal(false);
  isInputOpen = signal(false);
  selectedCategoryIds = signal<string[]>([]);

  entriesMap = computed(() => {
    const map = new Map<string, number>();
    const entries = this.allEntries();
    const activeFilters = this.selectedCategoryIds();

    entries.forEach((entry) => {
      // Se ci sono filtri, includi solo le note delle categorie selezionate
      if (activeFilters.length > 0 && !activeFilters.includes(entry.categoryId)) {
        return;
      }
      const dateKey = new Date(entry.date).toISOString().split('T')[0];
      const currentCount = map.get(dateKey) || 0;
      map.set(dateKey, currentCount + 1);
    });
    return map;
  });

  selectedDayEntries = computed(() => {
    let selected = this.selectedDate();
    if (!selected) return [];

    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const day = String(selected.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    const activeFilters = this.selectedCategoryIds();

    return this.allEntries().filter((entry) => {
      const entryDateKey = new Date(entry.date).toISOString().split('T')[0];
      const matchesDate = entryDateKey === key;
      const matchesCategory =
        activeFilters.length === 0 || activeFilters.includes(entry.categoryId);

      return matchesDate && matchesCategory;
    });
  });

  onDayClicked(event: MouseEvent, date: { day: number; month: number; year: number }) {
    event.stopPropagation();
    let selected = this.selectedDate();
    if (
      selected &&
      selected.getFullYear() === date.year &&
      selected.getMonth() === date.month &&
      selected.getDate() === date.day
    ) {
      this.selectedDate.set(null);
      return;
    } else {
      this.selectedDate.set(new Date(date.year, date.month, date.day));
    }
  }

  getEntryCount(dateMeta: { day: number; month: number; year: number }): number {
    // month 0-11
    const date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const key = `${year}-${month}-${day}`;
    return this.entriesMap().get(key) || 0;
  }

  async ngOnInit() {
    const today = new Date();
    // 2025 11 (Dicembre)
    this.isLoading.set(true);
    await this.noteService
      .getEntriesOfMonth(today.getFullYear(), today.getMonth())
      .then((entries) => {
        this.isLoading.set(false);

        this.allEntries.set(entries);
      });
  }

  async handleMonthChange(event: { month: number; year: number } | any) {
    const jsMonth = event.month;
    this.isLoading.set(true);
    await this.noteService.getEntriesOfMonth(event.year, jsMonth - 1).then((entries) => {
      this.isLoading.set(false);

      this.allEntries.set(entries);
    });
  }

  pushNewNoteIntoEntries(event: any) {
    this.allEntries.update((entries) => [...entries, event]);
    this.isInputOpen.set(false);
  }

  getLocalDateISO(): string | undefined {
    let date = this.selectedDate();
    if (!date) return undefined;
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString();
  }

  toggleCategoryFilter(categoryId: string) {
    this.selectedCategoryIds.update((ids) =>
      ids.includes(categoryId) ? ids.filter((id) => id !== categoryId) : [...ids, categoryId]
    );
  }

  clearCategoryFilters() {
    this.selectedCategoryIds.set([]);
  }
}
