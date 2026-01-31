import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardComponent } from '../../../shared/components/card/card';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { GameStore } from '../game.store';

@Component({
  selector: 'app-game-board-component',
  imports: [CardComponent, ButtonModule, DialogModule, CardModule, TagModule],
  templateUrl: './game-board-component.html',
  styleUrl: './game-board-component.css',
  providers: [GameStore],
})
export class GameBoardComponent implements OnInit {
  readonly store = inject(GameStore);

  ngOnInit() {
    this.store.initGame(32);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
