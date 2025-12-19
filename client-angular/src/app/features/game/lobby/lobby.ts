import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameStore } from '../game.store';

@Component({
  selector: 'app-lobby',
  imports: [CommonModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby {
  store = inject(GameStore);

  amIReady() {
    return this.store.me()?.isReady;
  }
}
