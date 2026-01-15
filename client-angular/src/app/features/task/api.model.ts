import { TaskItem } from '../../core/models/appwrite';

//export type CreateTaskPayload = Omit<TaskItem, '$id' | '$createdAt' | 'isCompleted'>;
export type CreateTaskPayload = {
  title: string;
  description: string | null;
  track: boolean;
  isCompleted: boolean;
  categoryId: string | null;
  tagIdList: string[] | null;
};
