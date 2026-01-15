import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserCategory, UserTag } from '../../../../core/models/user-metadata';
import { TaskItem } from '../../../../core/models/appwrite';
import { UserMetadaService } from '../../../../core/services/user-metada-service';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { UNKNOW_CATEGORY } from '../../../../core/data/user-metadata-default.data';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-edit-task',
  imports: [
    DialogModule,
    FormsModule,
    TablerIconComponent,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    TextareaModule,
    ToggleButtonModule,
  ],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css',
})
export class EditTask {
  // Models & Inputs
  isEditDialogVisible = model(false);
  editingTask = input<TaskItem | null>(null);

  // Outputs
  onSave = output<Partial<TaskItem>>();

  // Services & Data
  private userMetadata = inject(UserMetadaService);
  categories = this.userMetadata.categories;
  tags = this.userMetadata.tags;

  // Form State
  editTitle = signal('');
  editDescription = signal('');
  editTrack = signal(false);
  editSelectedCategories = signal<UserCategory[]>([]);
  editSelectedTags = signal<UserTag[]>([]);

  constructor() {
    effect(() => {
      const task = this.editingTask();
      if (task) {
        this.editTitle.set(task.title);
        this.editDescription.set(task.description || '');
        this.editTrack.set(task.track);

        if (task.categoryId) {
          const foundCat = this.categories().find((c) => c.id === task.categoryId);
          this.editSelectedCategories.set(foundCat ? [foundCat] : []);
        } else {
          this.editSelectedCategories.set([]);
        }

        if (task.tagIdList && task.tagIdList.length > 0) {
          const foundTags = this.tags().filter((t) => task.tagIdList?.includes(t.id));
          this.editSelectedTags.set(foundTags);
        } else {
          this.editSelectedTags.set([]);
        }
      }
    });
  }

  saveTask() {
    const currentTask = this.editingTask();
    if (!currentTask) return;

    const updatedData: Partial<TaskItem> = {
      title: this.editTitle(),
      description: this.editDescription(),
      track: this.editTrack(),
    };

    if (this.editTrack()) {
      updatedData.categoryId =
        this.editSelectedCategories().length > 0
          ? this.editSelectedCategories()[0].id
          : UNKNOW_CATEGORY.id;
      updatedData.tagIdList = this.editSelectedTags().map((t) => t.id);
    } else {
      updatedData.categoryId = null;
      updatedData.tagIdList = [];
    }

    this.onSave.emit(updatedData);
  }
}
