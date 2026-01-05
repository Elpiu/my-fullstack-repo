import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ID } from 'appwrite';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserTag } from '../../../core/models/user-metadata';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-tag-creator',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TablerIconComponent],
  template: `
    <div class="flex gap-2">
      <input
        pInputText
        [(ngModel)]="label"
        placeholder="Nuovo tag..."
        class="flex-1 text-sm"
        (keydown.enter)="create()"
      />
      <button pButton [disabled]="!label()" (click)="create()">
        <i-tabler name="plus" class=""></i-tabler>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagCreator {
  onCreate = output<UserTag>();
  label = signal('');

  create() {
    if (!this.label()) return;

    this.onCreate.emit({
      id: ID.unique(),
      label: this.label(),
    });
    this.label.set('');
  }
}
