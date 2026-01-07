import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NoteItem } from '../note-item/note-item';
import { SimpleEntry } from '../../../core/models/appwrite';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { NoteService } from '../../services/note-service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, DatePipe, NoteItem],
  templateUrl: './journal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalComponent {
  entries = input.required<SimpleEntry[]>();

  userMetadataService = inject(UserMetadaService);
  noteService = inject(NoteService);

  onDeleteEntry = output<string>();
  onEditEntry = output<SimpleEntry>();

  categorySignal = this.userMetadataService.categories;
  tagSignal = this.userMetadataService.tags;
}
