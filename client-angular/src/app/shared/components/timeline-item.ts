import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-timeline-item',
  imports: [],
  template: `
    <div class="flex w-full gap-4 relative">
      <div class="flex flex-col items-center w-12 flex-shrink-0">
        <span class="text-xs text-gray-400 font-semibold mb-1">{{ item().time }}</span>
        <div class="w-3 h-3 rounded-full z-10" [class]="dotColorClass()"></div>
        <div class="w-[2px] h-full bg-gray-100 absolute top-6 bottom-0 -z-0 left-[1.45rem]"></div>
      </div>

      <div
        class="flex-1 mb-6 p-4 rounded-2xl shadow-sm transition-transform active:scale-98 cursor-pointer"
        [class]="cardColorClass()"
      >
        <div class="flex justify-between items-start mb-2">
          @if (item().icon) {
          <i [class]="'pi ' + item().icon + ' text-2xl text-gray-800'"></i>
          } @else {
          <span class="text-sm text-gray-500 font-medium">{{ item().subtitle }}</span>
          }

          <button class="text-gray-500 hover:text-gray-800">
            <i class="pi pi-angle-down"></i>
          </button>
        </div>

        <div>
          @if (item().title) {
          <h3 class="text-lg font-bold text-gray-800">{{ item().title }}</h3>
          } @if (item().description) {
          <p [class]="textStyleClass()">
            {{ item().description }}
          </p>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItem {
  item = input.required<Task>();

  // Computed classes for Tailwind based on colorTheme
  cardColorClass = computed(() => {
    switch (this.item().colorTheme) {
      case 'mint':
        return 'bg-[#D0F4E8]'; // Custom pastel hex or tailwind generic
      case 'cyan':
        return 'bg-[#DDF6F6]';
      case 'purple':
        return 'bg-[#E6DFF8]';
      case 'peach':
        return 'bg-[#FADDC9]';
      default:
        return 'bg-white';
    }
  });

  dotColorClass = computed(() => {
    switch (this.item().colorTheme) {
      case 'mint':
        return 'bg-emerald-400';
      case 'cyan':
        return 'bg-cyan-300';
      case 'purple':
        return 'bg-purple-400';
      case 'peach':
        return 'bg-orange-300';
      default:
        return 'bg-gray-300';
    }
  });

  textStyleClass = computed(() => {
    // Handle the cursive font for specific types if needed
    return this.item().type === 'note'
      ? 'font-handwriting text-xl opacity-80 mt-1'
      : 'text-sm text-gray-600 font-medium mt-1';
  });
}
