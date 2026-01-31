import { Inject, Injectable } from "@angular/core";
import { BaseAppwriteService } from "./base.appwrite.service";
import { environment as env } from "../../../../src/environments/environment";
import { CreateUserMetadataPayload, UpdateUserMetadataPayload, UserMetadata } from "../api/user.metadata";
import { Models } from "appwrite";


export type UserInternalMetadata = Models.Row & {
  content: { [key: string]: any };
};

@Injectable({
    providedIn: 'root'
})
export class UserMetadataService extends BaseAppwriteService<UserMetadata, CreateUserMetadataPayload, UpdateUserMetadataPayload> {
protected readonly databaseId = env.database;
  protected readonly tableId = env.tb_user_metadata;
    protected override userId: string = "";


    protected override mapIn(row: UserMetadata): UserMetadata {
    return {
      ...row,
      content: row.content ? JSON.parse(row.content) : {},
    };
  }

  protected override mapOut(data: any): UserInternalMetadata {
    const payload = { ...data };
    if (payload.content) payload.content = JSON.stringify(payload.content);
    
    delete payload.content;
    return payload;
  }

}

