import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { GameStatus, Horse } from './interfaces';
import { computed, inject } from '@angular/core';
import { pipe, tap } from 'rxjs';
import { SocketService } from './socket.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface GameState {
  horses: Horse[];
  myId: string | null;
  status: GameStatus;
  countdown: number | null;
  isConnected: boolean;
}

const initialState: GameState = {
  horses: [],
  myId: null,
  status: 'WAITING',
  countdown: null,
  isConnected: false,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    // Computed signal: trovo il mio cavallo tra tutti
    me: computed(() => store.horses().find((h) => h.id === store.myId())),
    // Computed signal: lista ordinata per classifica (chi è più avanti)
    leaderboard: computed(() => [...store.horses()].sort((a, b) => b.position - a.position)),
  })),

  withMethods((store, socket = inject(SocketService)) => ({
    sendReady: () => socket.emitReady(),

    toggleSprint: (active: boolean) => socket.emitSprint(active),

    // --- ASCOLTATORI ---
    _onConnect: rxMethod<void>(
      pipe(tap(() => patchState(store, { isConnected: true, myId: socket.getSocketId() })))
    ),

    _onGameState: rxMethod<Horse[]>(pipe(tap((horses) => patchState(store, { horses })))),

    _onGameStatus: rxMethod<{ status: GameStatus; count?: number }>(
      pipe(
        tap((data) => {
          patchState(store, {
            status: data.status,
            countdown: data.count !== undefined ? data.count : null,
          });
        })
      )
    ),
  })),

  withHooks({
    onInit(store) {
      const socket = inject(SocketService);
      socket.connect(); // Connette al socket

      // Collega i listeners
      store._onConnect(socket.onConnect$());
      store._onGameState(socket.fromEvent<Horse[]>('gameState'));
      store._onGameStatus(socket.fromEvent<{ status: GameStatus; count?: number }>('gameStatus'));
    },
  })
);
