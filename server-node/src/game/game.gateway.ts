import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {}

  // Hook di NestJS: Appena il server parte
  afterInit() {
    this.gameService.setServer(this.server);
  }

  handleConnection(client: Socket) {
    console.log(`Client connesso: ${client.id}`);

    // Recupera user ID dall'auth token (se presente da Appwrite) o usa socket id
    const userId: string = client.handshake.auth.userId || client.id;

    // Aggiungi alla lobby
    const player = this.gameService.addHuman(
      client.id,
      `Player ${userId.slice(0, 4)}`,
    );

    if (!player) {
      client.emit('error', 'Gara già in corso, riprova più tardi.');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnesso: ${client.id}`);
    this.gameService.removePlayer(client.id);
  }

  @SubscribeMessage('playerReady')
  handleReady(@ConnectedSocket() client: Socket) {
    // Il giocatore segnala che è pronto
    this.gameService.setPlayerReady(client.id);
  }

  @SubscribeMessage('toggleSprint')
  handleSprint(
    @ConnectedSocket() client: Socket,
    @MessageBody() isSprinting: boolean,
  ) {
    this.gameService.toggleSprint(client.id, isSprinting);
  }
}
