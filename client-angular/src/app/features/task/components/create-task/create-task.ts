import { Component, computed, inject, output, signal, viewChild } from '@angular/core';
import { UserCategory, UserTag } from '../../../../core/models/user-metadata';
import { UserMetadaService } from '../../../../core/services/user-metada-service';
import { ButtonModule } from 'primeng/button';
import { TablerIconComponent } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { UNKNOW_CATEGORY } from '../../../../core/data/user-metadata-default.data';
import { InputTextModule } from 'primeng/inputtext';
import { CreateTaskPayload } from '../../api.model';

@Component({
  selector: 'app-create-task',
  imports: [
    ButtonModule,
    TablerIconComponent,
    FormsModule,
    MultiSelect,
    TooltipModule,
    InputTextModule,
  ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {
  addTaskItem = output<CreateTaskPayload>();

  private userMetadata = inject(UserMetadaService);

  categories = this.userMetadata.categories;
  tags = this.userMetadata.tags;

  // Input State
  newTaskTitle = signal('');
  newTaskTrack = signal(false);

  selectedCategories = signal<UserCategory[]>([]);
  selectedTags = signal<UserTag[]>([]);

  canCreateTask = computed(() => {
    if (!this.newTaskTrack()) {
      return this.newTaskTitle().trim().length > 0;
    } else {
      return this.newTaskTitle().trim().length > 0 && this.selectedCategories().length > 0;
    }
  });

  resetForm() {
    this.newTaskTitle.set('');
    //this.newTaskTrack.set(false);
    this.selectedCategories.set([]);
    this.selectedTags.set([]);
  }

  async addTask() {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    this.addTaskItem.emit({
      title: this.newTaskTitle(),
      track: this.newTaskTrack(),
      isCompleted: false,
      description: null,
      categoryId:
        this.selectedCategories().length > 0 ? this.selectedCategories()[0].id : UNKNOW_CATEGORY.id,
      tagIdList: this.selectedTags().map((t) => t.id),
    });
  }
}
