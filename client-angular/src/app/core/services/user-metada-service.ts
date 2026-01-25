import { computed, inject, Injectable, signal } from '@angular/core';

import { ID, Models, Permission, Query, Role, TablesDB } from 'appwrite';
import { APPWRITE_TABLE_DATABASE } from '../../../../projects/core/src/lib/providers/appwrite.config';
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from '../data/user-metadata-default.data';
import { NoteTemplate, UserCategory, UserTag } from '../models/user-metadata';
import { UserMetadata } from '../models/appwrite';
import { environment as env } from '../../../environments/environment';

interface UserMetadataState {
  rowId: string | null;
  categories: UserCategory[];
  tags: UserTag[];
  favoriteNotes: NoteTemplate[];
  isLoading: boolean;
  error: string | null;
  isFristLoad: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserMetadaService {
  private readonly tablesDb: TablesDB = inject(APPWRITE_TABLE_DATABASE);

  private readonly state = signal<UserMetadataState>({
    categories: [],
    tags: [],
    favoriteNotes: [],
    isLoading: false,
    error: null,
    isFristLoad: true,
    rowId: null,
  });

  private readonly userId = signal<string | null>(null);

  readonly categories = computed(() => this.state().categories);
  readonly tags = computed(() => this.state().tags);
  readonly favoriteNotes = computed(() => this.state().favoriteNotes);
  readonly isLoading = computed(() => this.state().isLoading);

  readonly mapCategories = computed<Record<string, UserCategory>>(() =>
    this.state().categories.reduce((acc, category) => ({ ...acc, [category.id]: category }), {}),
  );

  readonly mapTags = computed<Record<string, UserTag>>(() =>
    this.state().tags.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {}),
  );

  async loadUserMetadata(userId: string): Promise<void> {
    if (!this.state().isFristLoad) return;
    this.state.update((s) => ({ ...s, isLoading: true, error: null, isFristLoad: false }));

    this.userId.set(userId);

    try {
      const metadataDoc = await this.getUserMetadata(userId);
      this.deserializeAndUpdateState(metadataDoc);
    } catch (error: any) {
      console.error('Errore durante il caricamento dei metadati:', error);
      this.state.update((s) => ({ ...s, error: error.message || 'Unknown error' }));
    } finally {
      this.state.update((s) => ({ ...s, isLoading: false }));
    }
  }

  getNextCategoryIdFree(): string {
    const categories = this.state().categories;

    const numericIds = categories.map((c) => Number(c.id)).filter((n) => !isNaN(n));

    if (numericIds.length === 0) {
      return '1';
    }

    const maxId = Math.max(...numericIds);
    return String(maxId + 1);
  }

  getNextTagIdFree(): string {
    const tags = this.state().tags;

    const numericIds = tags.map((c) => Number(c.id)).filter((n) => !isNaN(n));

    if (numericIds.length === 0) {
      return '1';
    }

    const maxId = Math.max(...numericIds);
    return String(maxId + 1);
  }

  //--- CRUD
  async addCategory(newCat: Omit<UserCategory, 'id'>): Promise<void> {
    let newId = this.getNextCategoryIdFree();

    let copyState = this.state();
    copyState.categories.push({ ...newCat, id: newId });

    this.setUserMetadata(this.userId()!, copyState);
  }

  async deleteCategory(catId: string) {
    let copyState = this.state();
    copyState.categories = copyState.categories.filter((c) => c.id !== catId);
    this.setUserMetadata(this.userId()!, copyState);
  }

  async addTag(newTag: Omit<UserTag, 'id'>): Promise<void> {
    let newId = this.getNextTagIdFree();

    let copyState = this.state();
    copyState.tags.push({ ...newTag, id: newId });

    this.setUserMetadata(this.userId()!, copyState);
  }

  async deleteTag(tagId: string) {
    let copyState = this.state();
    copyState.tags = copyState.tags.filter((c) => c.id !== tagId);
    this.setUserMetadata(this.userId()!, copyState);
  }

  async addFavoriteNote(template: Omit<NoteTemplate, 'id'>): Promise<void> {
    const newId = crypto.randomUUID();
    const newTemplate: NoteTemplate = { ...template, id: newId };

    let copyState = this.state();
    copyState.favoriteNotes.push(newTemplate);

    await this.setUserMetadata(this.userId()!, copyState);
  }

  async deleteFavoriteNote(templateId: string): Promise<void> {
    let copyState = this.state();
    copyState.favoriteNotes = copyState.favoriteNotes.filter((n) => n.id !== templateId);
    await this.setUserMetadata(this.userId()!, copyState);
  }

  // --- End CRUD

  private async setUserMetadata(userId: string, userMetaState: UserMetadataState) {
    const payload = {
      categoriesJson: JSON.stringify(userMetaState.categories),
      tagsJson: JSON.stringify(userMetaState.tags),
      favoriteNotesJson: JSON.stringify(userMetaState.favoriteNotes || []),
    };

    let metadata: any;

    try {
      metadata = await this.tablesDb.updateRow<UserMetadata>({
        databaseId: env.database,
        tableId: env.tb_user_metadata,
        rowId: this.state().rowId!,
        data: payload,
        permissions: [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });
    } catch (error) {
      console.error('Something went wrong setUserMetadata function', error);
      throw error;
    }

    try {
      this.deserializeAndUpdateState(metadata);
    } catch (error) {
      console.error('Something went wrong deserializeAndUpdateState function', error);
      throw error;
    }
  }

  private async getUserMetadata(userId: string): Promise<UserMetadata> {
    try {
      const response = await this.tablesDb.listRows<UserMetadata>({
        databaseId: env.database,
        tableId: env.tb_user_metadata,
        //queries: [Query.limit(1)],
      });

      const rows = response.rows;
      const total = response.total;

      if (total === 0 || rows.length === 0) {
        console.log('Nessun metadata trovato, creazione default...');
        return await this.addDefaultUserMetadata(userId);
      }

      return rows[0];
    } catch (error) {
      console.error('Something went wrong getUserMetadata function', error);
      throw error;
    }
  }

  private async addDefaultUserMetadata(userId: string): Promise<UserMetadata> {
    return await this.tablesDb.createRow<UserMetadata>({
      databaseId: env.database,
      tableId: env.tb_user_metadata,
      rowId: ID.unique(),
      data: {
        categoriesJson: JSON.stringify(DEFAULT_CATEGORIES),
        tagsJson: JSON.stringify(DEFAULT_TAGS),
      } as any,
      permissions: [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });
  }

  private deserializeAndUpdateState(rowData: UserMetadata): void {
    try {
      const parsedCategories: UserCategory[] = rowData.categoriesJson
        ? JSON.parse(rowData.categoriesJson)
        : [];

      const parsedTags: UserTag[] = rowData.tagsJson ? JSON.parse(rowData.tagsJson) : [];

      const parsedFavorites: NoteTemplate[] = rowData.favoriteNotesJson
        ? JSON.parse(rowData.favoriteNotesJson)
        : [];

      const rowId = rowData.$id;

      this.state.update((s) => ({
        ...s,
        categories: parsedCategories,
        tags: parsedTags,
        rowId: rowId,
        favoriteNotes: parsedFavorites,
      }));
    } catch (e) {
      console.error('Errore nel parsing del JSON dei metadati:', e);
      this.state.update((s) => ({
        ...s,
        categories: DEFAULT_CATEGORIES,
        tags: DEFAULT_TAGS,
      }));
    }
  }
}
