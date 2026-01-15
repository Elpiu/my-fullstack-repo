import { Component, inject, input } from '@angular/core';
import { UserMetadaService } from '../../../core/services/user-metada-service';

@Component({
  selector: 'tag-item',
  template: ` <span
    class="text-xs text-color-secondary bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md"
  >
    #{{ getTagLabel(tagId()) }}
  </span>`,
})
export class TagComponent {
  tagId = input.required<string>();
  userMetadata = inject(UserMetadaService);

  getTagLabel(tagId: string): string {
    return this.userMetadata.mapTags()[tagId]?.label ?? 'N/A';
  }
}

@Component({
  selector: 'tag-list-item',
  template: `
    @let tagList = tagIdList(); @if(tagList && tagList.length > 0) {
    <div class="mt-2 flex flex-wrap gap-2 pt-3 border-t border-surface">
      @for(tagId of tagIdList(); track $index) {
      <span
        class="text-xs text-color-secondary bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md"
      >
        <tag-item [tagId]="tagId"></tag-item>
      </span>
      }
    </div>
    }
  `,
  imports: [TagComponent],
})
export class TagListComponent {
  tagIdList = input<string[]>();
}
