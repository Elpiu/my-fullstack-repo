import { inject, Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { NoteService } from '../../shared/services/note-service';
import { UserMetadaService } from './user-metada-service';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private noteService = inject(NoteService);
  private metadataService = inject(UserMetadaService);

  // Esempi di testi casuali per Minder
  private sampleTexts = [
    'Allenamento gambe intenso in palestra',
    'Comprato croccantini per il gatto',
    'Tagliando auto effettuato',
    'Cena fuori con amici al centro',
    'Sessione di meditazione 20 minuti',
    'Pulizia profonda del bagno',
    'Riunione di lavoro progetto X',
    'Letto 30 pagine del libro attuale',
    'Passeggiata al parco 5km',
    'Preparazione pasti per la settimana',
    'Pagata bolletta luce',
    'Cambiato lenzuola',
    'Revisione obiettivi mensili',
    'Sistemato archivio documenti',
  ];

  async generateMockNotes(count: number = 35) {
    const categories = this.metadataService.categories();
    const tags = this.metadataService.tags();

    if (categories.length === 0) {
      console.error('Nessuna categoria trovata. Crea prima delle categorie!');
      return;
    }

    console.log(`Inizio generazione di ${count} note mock...`);

    for (let i = 0; i < count; i++) {
      // 1. Data casuale (da oggi a 30 giorni nel futuro)
      const randomDate = this.getRandomDate(0, 30);

      // 2. Categoria casuale
      const randomCat = categories[Math.floor(Math.random() * categories.length)];

      // 3. Tag casuali (da 0 a 3 tag)
      const randomTags = this.getRandomSubarray(tags, Math.floor(Math.random() * 4)).map(
        (t) => t.id
      );

      // 4. Testo casuale
      const randomText = this.sampleTexts[Math.floor(Math.random() * this.sampleTexts.length)];

      const payload = {
        content: `${randomText} (${i + 1})`,
        date: randomDate.toISOString(), // O il formato richiesto dal tuo DB (es. YYYY-MM-DD)
        categoryId: randomCat.id,
        tagIdList: randomTags.length > 0 ? randomTags : null,
      };

      try {
        await this.noteService.createNote(payload);
      } catch (err) {
        console.error('Errore durante la creazione della nota mock:', err);
      }
    }

    console.log('Generazione completata!');
  }

  /**
   * Genera una data casuale tra 'startDays' e 'endDays' da oggi
   */
  private getRandomDate(startDays: number, endDays: number): Date {
    const date = new Date();
    const randomDays = Math.floor(Math.random() * (endDays - startDays + 1)) + startDays;
    date.setDate(date.getDate() + randomDays);
    // Opzionale: randomizza anche l'ora per rendere il calendario più vivo
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    return date;
  }

  /**
   * Prende N elementi casuali da un array
   */
  private getRandomSubarray<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
}
