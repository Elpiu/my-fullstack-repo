export interface UserCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface UserTag {
  id: string;
  label: string;
}

export interface NoteTemplate {
  id: string;
  label: string;
  categoryId: string;
  tagIdList: string[];
}
