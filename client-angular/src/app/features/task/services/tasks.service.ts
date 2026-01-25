import { computed, inject, Injectable } from '@angular/core';
import { ID, Models, Permission, Query, Role, TablesDB } from 'appwrite';
import { APPWRITE_TABLE_DATABASE } from '../../../../../projects/core/src/lib/providers/appwrite.config';
import { AppStore } from '../../../core/store/AppStore';
import { TaskItem } from '../../../core/models/appwrite';
import { environment as env } from '../../../../environments/environment';
import { CreateTaskPayload } from '../api.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly tablesDb: TablesDB = inject(APPWRITE_TABLE_DATABASE);
  private readonly appStore = inject(AppStore);

  userId = computed(() => this.appStore.user()?.$id || '');

  async getTasks(): Promise<Models.RowList<TaskItem>> {
    try {
      return await this.tablesDb.listRows<TaskItem>({
        databaseId: env.database,
        tableId: env.tb_task_item,
        queries: [Query.orderDesc('$createdAt')],
      });
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async createTask(payload: CreateTaskPayload): Promise<TaskItem> {
    try {
      return await this.tablesDb.createRow<TaskItem>({
        databaseId: env.database,
        tableId: env.tb_task_item,
        rowId: ID.unique(),
        data: payload,
        permissions: [
          Permission.read(Role.user(this.userId())),
          Permission.update(Role.user(this.userId())),
          Permission.delete(Role.user(this.userId())),
        ],
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, data: Partial<TaskItem>): Promise<TaskItem> {
    try {
      const { $id, $createdAt, ...cleanData } = data as any;

      return await this.tablesDb.updateRow<TaskItem>({
        databaseId: env.database,
        tableId: env.tb_task_item,
        rowId: id,
        data: cleanData,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.tablesDb.deleteRow({
        databaseId: env.database,
        tableId: env.tb_task_item,
        rowId: id,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}
