import { inject, Injectable } from '@angular/core';
import { ID, Models, Permission, Query, Role, TablesDB } from 'appwrite';
import { APPWRITE_TABLE_DATABASE } from '../../appwrite/appwrite.config';
import { SimpleEntry } from '../../core/models/appwrite';
import { AppStore } from '../../core/store/AppStore';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly tablesDb: TablesDB = inject(APPWRITE_TABLE_DATABASE);
  private readonly appStore = inject(AppStore);

  async getTodayEntries(): Promise<Models.RowList<SimpleEntry>> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      return await this.tablesDb.listRows<SimpleEntry>({
        databaseId: env.database,
        tableId: env.tb_entry,
        queries: [
          Query.between('date', startOfDay.toISOString(), endOfDay.toISOString()),
          Query.orderDesc('date'),
        ],
      });
    } catch (error) {
      console.error('Errore nel caricamento delle note di oggi:', error);
      throw error;
    }
  }

  date: string = new Date().toISOString();
  async createNote(payload: {
    tagIdList: string[] | null;
    content: string;
    date: string;
    categoryId: string;
  }): Promise<SimpleEntry> {
    try {
      const userId = this.appStore.user()?.$id || '';

      const row = await this.tablesDb.createRow<SimpleEntry>({
        databaseId: env.database,
        tableId: env.tb_entry,
        rowId: ID.unique(),
        data: payload,
        permissions: [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });

      return row;
    } catch (error) {
      console.error('Errore nella creazione della nota:', error);
      throw error;
    }
  }

  async deleteNote(rowId: string): Promise<void> {
    try {
      await this.tablesDb.deleteRow({
        databaseId: env.database,
        tableId: env.tb_entry,
        rowId: rowId,
      });
    } catch (error) {
      console.error(`Errore durante l'eliminazione della nota ${rowId}:`, error);
      throw error;
    }
  }

  async getEntriesOfMonth(year: number, month: number): Promise<SimpleEntry[]> {
    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    try {
      const response = await this.tablesDb.listRows<SimpleEntry>({
        databaseId: env.database,
        tableId: env.tb_entry,
        queries: [
          Query.between('date', startOfMonth.toISOString(), endOfMonth.toISOString()),
          Query.orderDesc('$createdAt'),
          Query.limit(1000),
        ],
      });

      return response.rows || [];
    } catch (error) {
      console.error('Errore getEntriesOfMonth:', error);
      return [];
    }
  }
}
