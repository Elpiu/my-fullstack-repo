import { Component, computed, input, output } from '@angular/core';
import { CardState } from '../../../features/game/game.api';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styles: [
    `
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
    `,
  ],
})
export class CardComponent {
  id = input.required<string>();
  content = input.required<string>();
  state = input.required<CardState>();

  cardClick = output<string>();

  isOpen = computed(() => this.state() === CardState.VISIBLE || this.state() === CardState.MATCHED);

  handleClick() {
    if (this.state() === CardState.HIDDEN) {
      this.cardClick.emit(this.id());
    }
  }
}
