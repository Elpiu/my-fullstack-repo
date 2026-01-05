import { Component, inject, input } from '@angular/core';
import { UNKNOW_CATEGORY } from '../../../core/data/user-metadata-default.data';
import { SimpleEntry } from '../../../core/models/appwrite';
import { UserCategory } from '../../../core/models/user-metadata';
import { UserMetadaService } from '../../../core/services/user-metada-service';

@Component({
  selector: 'app-note-item',
  imports: [],
  template: `
    @let category = getCategoryById(item().categoryId);
    <div
      class=" rounded-2xl p-4 shadow-sm cursor-pointer transition-transform hover:scale-[1.01] active:scale-95 border border-transparent bg-surface-400 hover:border-black/5"
      [class]="category.color"
    >
      <div class="flex justify-between items-start mb-2 opacity-70">
        <i [class]="'pi ' + category.icon"></i>
        <i class="pi pi-chevron-down text-xs"></i>
      </div>

      <h3 class="font-bold  mb-1 leading-tight">
        {{ category.label }}
      </h3>
      <p class="text-sm t line-clamp-2">
        {{ item().content }}
      </p>

      @if(item().tagIdList) {
      <div class="mt-2 flex gap-1">
        @for(tag of item().tagIdList; track $index) {
        <span class="text-xs font-bold opacity-60">#{{ getTagLabel(tag) }}</span>
        }
      </div>
      }
    </div>
  `,
})
export class NoteItem {
  item = input.required<SimpleEntry>();

  userMetadata = inject(UserMetadaService);
  categories = this.userMetadata.mapCategories;
  tags = this.userMetadata.mapTags;

  getCategoryById(categoryId: string): UserCategory {
    return this.categories()[categoryId] ?? UNKNOW_CATEGORY;
  }

  getTagLabel(tagId: string): string {
    return this.tags()[tagId]?.label ?? 'N/A';
  }
}
