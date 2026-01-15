import { Component, inject, signal, computed, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TablerIconComponent } from 'angular-tabler-icons';

import { TasksService } from './services/tasks.service';
import { UNKNOW_CATEGORY } from '../../core/data/user-metadata-default.data';
import { TaskItemComponent } from './components/task-item.component';
import { TaskItem } from '../../core/models/appwrite';
import { NoteService } from '../../shared/services/note-service';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserMetadaService } from '../../core/services/user-metada-service';
import { UserCategory, UserTag } from '../../core/models/user-metadata';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { EditTask } from './components/edit-task/edit-task';
import { DialogModule } from 'primeng/dialog';
import { CreateTask } from './components/create-task/create-task';
import { CreateTaskPayload } from './api.model';

@Component({
  selector: 'app-taskd-page',
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    ToggleButtonModule,
    TablerIconComponent,
    TooltipModule,
    MultiSelectModule,
    ConfirmPopupModule,
    EditTask,
    DialogModule,
    CreateTask,
  ],
  templateUrl: './taskd-page.html',
  styleUrl: './taskd-page.css',
})
export class TaskdPage implements OnInit {
  createTaskComponent = viewChild<CreateTask>('createTaskComponent');

  // Services
  private tasksService = inject(TasksService);
  private noteService = inject(NoteService);
  private messageService = inject(MessageService);
  private userMetadata = inject(UserMetadaService);
  private confirmationService = inject(ConfirmationService);

  // State
  tasks = signal<TaskItem[]>([]);
  isLoading = signal(true);

  isViewDialogVisible = signal(false);
  isEditDialogVisible = signal(false);

  taskItemToView = signal<TaskItem | null>(null);

  categories = this.userMetadata.categories;
  tags = this.userMetadata.tags;

  // Computed
  activeTasks = computed(() => this.tasks().filter((t) => !t.isCompleted));
  completedTasks = computed(() => this.tasks().filter((t) => t.isCompleted));

  updateTask(updatedTask: TaskItem) {
    console.log('Updating task:', updatedTask);
  }

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    this.isLoading.set(true);
    await this.tasksService
      .getTasks()
      .then((res) => this.tasks.set(res.rows))
      .catch((err) => console.error(err))
      .finally(() => this.isLoading.set(false));
  }

  async addTask(newTaskData: CreateTaskPayload) {
    const newTask = await this.tasksService
      .createTask({ ...newTaskData })
      .then((res) => {
        this.tasks.update((curr) => [res, ...curr]);
        this.createTaskComponent()?.resetForm();
      })
      .catch((err) =>
        console.error(
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Cannot create task',
          })
        )
      );
  }

  async toggleTask(task: TaskItem) {
    const newState = !task.isCompleted;

    await this.tasksService
      .updateTask(task.$id, { isCompleted: newState })
      .then(() => {
        this.tasks.update((curr) =>
          curr.map((t) => (t.$id === task.$id ? { ...t, isCompleted: newState } : t))
        );

        // TODO EM se non c'è la categoria, aggiungere
        if (newState && task.track) {
          this.noteService
            .createNote({
              content:
                `From Task: ${task.title}` + task.description ? `\n\n${task.description}` : '',
              categoryId: task.categoryId ?? UNKNOW_CATEGORY.id,
              tagIdList: task.tagIdList,
              date: new Date().toISOString(),
            })
            .then(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Tracked',
                detail: 'Added to journal',
              });
            });
        }
      })
      .catch((err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating task',
        });
      });

    this.tasks.update((curr) =>
      curr.map((t) => (t.$id === task.$id ? { ...t, isCompleted: newState } : t))
    );
  }

  async deleteTask(id: string) {
    await this.tasksService
      .deleteTask(id)
      .then(() => this.tasks.update((curr) => curr.filter((t) => t.$id !== id)))
      .catch((err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting task',
        });
      });
  }

  async clearAllCompletedTasks() {
    this.completedTasks().forEach(async (t) => await this.deleteTask(t.$id));

    this.loadTasks();
  }

  confirmClearAll(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure you want to clear all completed tasks?',
      rejectButtonProps: {
        label: 'Back',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        outlined: true,
      },
      accept: () => {
        this.clearAllCompletedTasks();
      },
      reject: () => {},
    });
  }

  setViewTask(task: TaskItem) {
    this.taskItemToView.set(task);
    this.isViewDialogVisible.set(true);
  }
  setEditTask(task: TaskItem) {
    this.taskItemToView.set(task);
    this.isEditDialogVisible.set(true);
  }

  async handleEditTaskSave(updatedData: Partial<TaskItem>) {
    const originalTask = this.taskItemToView();
    if (!originalTask) return;

    const { $id, $createdAt, ...payload } = updatedData as any;

    if (!this.hasTaskChanged(originalTask, payload)) {
      this.isEditDialogVisible.set(false);
      return;
    }

    await this.tasksService
      .updateTask(originalTask.$id, payload)
      .then((updatedTask) => {
        this.tasks.update((curr) => curr.map((t) => (t.$id === updatedTask.$id ? updatedTask : t)));
        this.isEditDialogVisible.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task updated successfully',
        });
      })
      .catch((err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating task',
        });
      });
  }

  private hasTaskChanged(original: TaskItem, updated: Partial<TaskItem>): boolean {
    const titleChanged = updated.title !== undefined && updated.title !== original.title;
    const descChanged =
      updated.description !== undefined && updated.description !== original.description;
    const trackChanged = updated.track !== undefined && updated.track !== original.track;

    const catChanged =
      updated.categoryId !== undefined && updated.categoryId !== original.categoryId;

    const originalTags = original.tagIdList || [];
    const updatedTags = updated.tagIdList || [];

    const tagsChanged =
      originalTags.length !== updatedTags.length ||
      !updatedTags.every((t) => originalTags.includes(t));

    return titleChanged || descChanged || trackChanged || catChanged || tagsChanged;
  }
}
