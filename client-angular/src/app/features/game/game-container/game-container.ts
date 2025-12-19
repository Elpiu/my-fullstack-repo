import { Component, inject } from '@angular/core';
import { GameStore } from '../game.store';
import { Lobby } from '../lobby/lobby';
import { RaceTrack } from '../race-track/race-track';

@Component({
  selector: 'app-game-container',
  imports: [Lobby, RaceTrack],
  templateUrl: './game-container.html',
  styleUrl: './game-container.css',
})
export class GameContainer {
  store = inject(GameStore);
}
