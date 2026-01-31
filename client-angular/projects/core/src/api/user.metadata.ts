import { Models } from 'appwrite';

export type UserMetadata = Models.Row & {
  content: string;
  userId: string;
};

export type CreateUserMetadataPayload = {
  content: string;
  userId: string;
};

export type UpdateUserMetadataPayload = {
  content: string;
};
