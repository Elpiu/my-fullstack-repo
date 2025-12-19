import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { CONSTANTS, GameStatus, Player } from './interfaces';

@Injectable()
export class GameService {
  private players: Map<string, Player> = new Map();
  private status: GameStatus = 'WAITING';
  private gameLoopInterval: NodeJS.Timeout | null = null;
  private server: Server; // Riferimento al server Socket.io per i broadcast

  setServer(server: Server) {
    this.server = server;
  }

  // --- GESTIONE LOBBY ---

  addHuman(clientId: string, name: string = 'Player') {
    if (this.status !== 'WAITING') return null;

    const newPlayer: Player = {
      id: clientId,
      isHuman: true,
      isReady: false,
      color: '#00ff00',
      name: name,
      position: 0,
      stamina: 100,
      baseSpeed: 0.6 + Math.random() * 0.2,
      isSprinting: false,
      finished: false,
    };

    this.players.set(clientId, newPlayer);
    return newPlayer;
  }

  removePlayer(clientId: string) {
    this.players.delete(clientId);
    // Se escono tutti, resetta
    if (this.players.size === 0) {
      this.resetGame();
    }
  }

  setPlayerReady(clientId: string) {
    const player = this.players.get(clientId);
    if (player && player.isHuman) {
      player.isReady = true;
      this.checkStartCondition();
    }
  }

  private checkStartCondition() {
    // Regola: La partita parte se c'è almeno 1 giocatore e TUTTI gli umani sono pronti
    const humans = Array.from(this.players.values()).filter((p) => p.isHuman);

    if (humans.length > 0 && humans.every((p) => p.isReady)) {
      this.startCountdown();
    }
  }

  // --- START GAME LOGIC ---

  private startCountdown() {
    this.status = 'COUNTDOWN';
    this.fillWithBots(); // Riempie gli slot vuoti

    let count = 3;
    const countdownInterval = setInterval(() => {
      this.server.emit('gameStatus', { status: 'COUNTDOWN', count });
      count--;

      if (count < 0) {
        clearInterval(countdownInterval);
        this.startGameLoop();
      }
    }, 1000);
  }

  private fillWithBots() {
    const currentCount = this.players.size;
    const botsNeeded = CONSTANTS.MAX_PLAYERS - currentCount;

    for (let i = 0; i < botsNeeded; i++) {
      const botId = `bot_${Date.now()}_${i}`;
      const botName = CONSTANTS.BOT_NAMES[i % CONSTANTS.BOT_NAMES.length];

      this.players.set(botId, {
        id: botId,
        isHuman: false,
        isReady: true,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Colore random
        name: `${botName} (BOT)`,
        position: 0,
        stamina: 100,
        baseSpeed: 0.5 + Math.random() * 0.3, // I bot hanno statistiche varie
        isSprinting: false,
        finished: false,
      });
    }

    // Notifica il client che sono arrivati i bot
    this.broadcastState();
  }

  // --- CORE LOOP (FISICA) ---

  private startGameLoop() {
    this.status = 'RACING';
    this.server.emit('gameStatus', { status: 'RACING' });

    this.gameLoopInterval = setInterval(() => {
      let activeRunners = 0;

      this.players.forEach((player) => {
        if (player.finished) return;

        activeRunners++;

        // 1. Gestione AI Bot (Semplificata)
        if (!player.isHuman) {
          this.handleBotAI(player);
        }

        // 2. Fisica Velocità
        let speed = player.baseSpeed;

        if (player.isSprinting && player.stamina > 0) {
          speed *= 2.2; // Boost notevole
          player.stamina = Math.max(0, player.stamina - 0.8); // Consumo stamina
        } else {
          // Recupero lento se non sprinta
          player.stamina = Math.min(100, player.stamina + 0.15);
        }

        // 3. Aggiornamento Posizione
        player.position += speed;

        // 4. Check Traguardo
        if (player.position >= CONSTANTS.FINISH_LINE) {
          player.position = CONSTANTS.FINISH_LINE;
          player.finished = true;
        }
      });

      // Invia stato a tutti
      this.broadcastState();

      // Stop se tutti hanno finito
      if (activeRunners === 0) {
        this.endGame();
      }
    }, CONSTANTS.TICK_RATE);
  }

  private handleBotAI(bot: Player) {
    // Logica AI stupida ma efficace:
    // Sprinta se ha molta stamina (> 80)
    // Smette se ha poca stamina (< 20)
    // Randomicamente cambia stato ogni tanto
    if (bot.stamina > 80 && Math.random() > 0.9) bot.isSprinting = true;
    if (bot.stamina < 20) bot.isSprinting = false;
  }

  toggleSprint(playerId: string, isSprinting: boolean) {
    const player = this.players.get(playerId);
    if (player && !player.finished && this.status === 'RACING') {
      player.isSprinting = isSprinting;
    }
  }

  private broadcastState() {
    // Trasforma la Map in Array per il JSON
    const state = Array.from(this.players.values());
    this.server.emit('gameState', state);
  }

  private endGame() {
    if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
    this.status = 'FINISHED';
    this.server.emit('gameStatus', { status: 'FINISHED' });

    // Reset dopo 5 secondi per nuova partita
    setTimeout(() => this.resetGame(), 5000);
  }

  private resetGame() {
    if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
    this.players.clear();
    this.status = 'WAITING';
    this.server.emit('gameStatus', { status: 'WAITING' });
    // NB: In un caso reale, non disconnetteresti i player, ma li rimetteresti in stato "Not Ready"
  }
}
