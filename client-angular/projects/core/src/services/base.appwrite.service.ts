import { inject } from "@angular/core";
import { ID, Models, Permission, Role, TablesDB } from "appwrite";
import { APPWRITE_TABLE_DATABASE } from "../providers/appwrite.config";


export abstract class BaseAppwriteService<T extends Models.Row, CreatePayload = any, UpdatePayload = any> {

    protected readonly tablesDB : TablesDB = inject(APPWRITE_TABLE_DATABASE)

    // Abstract properties to be defined in derived classes
    protected abstract readonly databaseId: string;
    protected abstract readonly tableId: string;
    protected abstract readonly userId: string;

    /**
     * Generate a default set of permissions for a given user ID.
     * Note: This method can be overridden in derived classes to customize permission logic.
     * @param userId - The ID of the user for whom to generate permissions.
     * @returns An array of Permission objects granting read, update, and delete access to the specified user. 
     */
    protected getPermissions(userId: string): string[] {
        return [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
        ];
    }


    // Crud Operations
    
  async list(queries: string[] = []): Promise<T[]> {
    try {
      const response = await this.tablesDB.listRows<T>({
        databaseId: this.databaseId,
        tableId: this.tableId,
        queries: queries,
      });
      return response.rows.map(row => this.mapIn(row)); // Hook trasformazione
    } catch (error) {
      this.handleError('List', error);
      return [];
    }
  }

  async get(rowId: string): Promise<T> {
    const row = await this.tablesDB.getRow<T>({
      databaseId: this.databaseId,
      tableId: this.tableId,
      rowId,
    });
    return this.mapIn(row);
  }

  async create(payload: CreatePayload): Promise<T> {

    const data = this.mapOut(payload); // Hook trasformazione

    const row = await this.tablesDB.createRow<T>({
      databaseId: this.databaseId,
      tableId: this.tableId,
      rowId: ID.unique(),
      data: data as any,
      permissions: this.getPermissions(this.userId),
    });
    return this.mapIn(row);
  }

  async update(rowId: string, payload: Partial<UpdatePayload>): Promise<T> {
    const data = this.mapOut(payload);
    const row = await this.tablesDB.updateRow<T>({
      databaseId: this.databaseId,
      tableId: this.tableId,
      rowId: rowId,
      data: data as any,
    });
    return this.mapIn(row);
  }

  async delete(rowId: string): Promise<void> {
    await this.tablesDB.deleteRow({
      databaseId: this.databaseId,
      tableId: this.tableId,
      rowId: rowId,
    });
  }

    // --- Transformation HOOKS ---

  /** Transform data going out to Appwrite (e.g., JSON.stringify) */
  protected mapOut(data: any): any { return data; }

  /** Transform data coming in from Appwrite (e.g., JSON.parse) */
  protected mapIn(row: T): T { return row; }

  protected handleError(context: string, error: any): void {
    console.error(`[${this.constructor.name}] Error in ${context}:`, error);
    throw error;
  }

}