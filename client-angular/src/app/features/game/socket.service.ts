import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

// URL del backend NestJS (nello sviluppo locale)
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor() {
    // Inizializzazione della connessione
    // transports: ['websocket'] forza l'uso immediato di WS senza polling HTTP
    this.socket = io(SERVER_URL, {
      transports: ['websocket'],
      autoConnect: false, // Gestiamo noi la connessione manualmente
    });
  }

  // --- GESTIONE CONNESSIONE ---

  /**
   * Avvia la connessione e passa eventuali parametri di auth (es. userId di Appwrite)
   */
  connect(userId?: string) {
    if (userId) {
      this.socket.auth = { userId };
    }
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  /**
   * Ritorna l'ID del socket corrente (utile per capire "chi sono io" nella gara)
   */
  getSocketId(): string | undefined {
    return this.socket.id;
  }

  // --- EMITTENTI (Output verso il Server) ---

  /**
   * Invia al server l'intenzione di sprintare (o smettere)
   */
  emitSprint(isSprinting: boolean) {
    this.socket.emit('toggleSprint', isSprinting);
  }

  emitReady() {
    this.socket.emit('playerReady');
  }

  // --- ASCOLTATORI (Input dal Server) ---

  /**
   * Crea un Observable generico per ascoltare eventi dal server.
   * Utile per trasformare gli eventi socket in stream RxJS.
   */
  fromEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      // Quando arriva l'evento, emetti il dato
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      // Cleanup quando l'observable viene distrutto (unsubscribe)
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  /**
   * Stream specifico per gli aggiornamenti di stato del gioco
   */
  getGameState$() {
    return this.fromEvent<any[]>('gameState');
  }

  /**
   * Stream per sapere quando siamo connessi
   */
  onConnect$() {
    return this.fromEvent<void>('connect');
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
