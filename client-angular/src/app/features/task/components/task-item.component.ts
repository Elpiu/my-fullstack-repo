import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconComponent } from 'angular-tabler-icons';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { UserMetadaService } from '../../../core/services/user-metada-service';
import { UNKNOW_CATEGORY } from '../../../core/data/user-metadata-default.data';
import { TaskItem } from '../../../core/models/appwrite';
import { TagListComponent } from '../../../shared/components/tag/tag.components';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    TablerIconComponent,
    CheckboxModule,
    ButtonModule,
    FormsModule,
    TooltipModule,
    TagListComponent,
  ],
  template: `
    @let category = categoryData();

    <div
      class="
        flex items-center gap-3 p-3 rounded-xl border
        transition-all duration-300
        group relative
      "
      [class]="
        task().isCompleted
          ? 'bg-surface-50 dark:bg-surface-900 border-transparent opacity-60'
          : 'bg-surface-card border-surface hover:border-primary-300 dark:hover:border-primary-700 shadow-sm'
      "
    >
      <!-- 1. CHECKBOX -->
      <div class="relative flex items-center justify-center">
        <p-checkbox
          [binary]="true"
          [ngModel]="task().isCompleted"
          (onChange)="onToggle.emit(task())"
          [disabled]="loading()"
          styleClass="scale-110"
        />
      </div>

      <!-- 2. CONTENT -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Title -->
        <span
          class="flex gap-2 font-medium text-color truncate transition-all decoration-2"
          [class.line-through]="task().isCompleted"
        >
          {{ task().title }}

          @if (task().description && !task().isCompleted) {
          <button
            (click)="$event.stopPropagation(); onViewDescription.emit(task())"
            class="flex items-center text-surface-500 hover:text-primary transition-colors focus:outline-none"
            pTooltip="View notes"
            tooltipPosition="bottom"
          >
            <tabler-icon name="file-text" class="w-3 h-3"></tabler-icon>
          </button>
          }
        </span>

        @if (task().track) {
        <div
          class="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <!-- Category -->
          <div
            class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide opacity-80"
            [style.color]="'var(--p-' + category.color"
          >
            <tabler-icon [name]="category.icon" class="w-3 h-3"></tabler-icon>
            <span>{{ category.label }}</span>
          </div>

          <!-- Bookmark Icon (Sempre visibile se track è true) -->
          <span
            class="text-primary-500 flex items-center"
            pTooltip="Will be saved in the diary after completion"
            tooltipPosition="bottom"
          >
            <tabler-icon name="bookmark" class="w-3 h-3 filled-icon"></tabler-icon>
          </span>
        </div>
        }
        <tag-list-item [tagIdList]="task().tagIdList ?? []" />
      </div>

      <div
        class="flex items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
      >
        @if(!task().isCompleted) {
        <p-button
          [rounded]="true"
          [text]="true"
          severity="secondary"
          (onClick)="onEdit.emit(task())"
        >
          <tabler-icon name="pencil"></tabler-icon>
        </p-button>
        }

        <p-button
          [rounded]="true"
          [text]="true"
          severity="danger"
          (onClick)="onDelete.emit(task().$id)"
        >
          <tabler-icon name="trash" class=""></tabler-icon>
        </p-button>
      </div>
    </div>
  `,
  styles: [
    `
      .filled-icon {
        fill: currentColor;
      }
    `,
  ],
})
export class TaskItemComponent {
  task = input.required<TaskItem>();
  loading = input<boolean>(false);

  onToggle = output<TaskItem>();
  onDelete = output<string>();

  onEdit = output<TaskItem>();
  onViewDescription = output<TaskItem>();

  private userMetadata = inject(UserMetadaService);

  categoryData = computed(() => {
    const catId = this.task().categoryId;
    if (!catId) return UNKNOW_CATEGORY;
    return this.userMetadata.mapCategories()[catId] ?? UNKNOW_CATEGORY;
  });
}
