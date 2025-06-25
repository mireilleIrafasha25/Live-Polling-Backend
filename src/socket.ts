// socket.ts
import { Server } from 'http';
import { WebSocketServer } from 'ws';

let wss: WebSocketServer;

export const initSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (socket:any) => {
    console.log('🔌 A client connected to WebSocket');

    socket.send(JSON.stringify({ message: 'Connected to WebSocket server' }));

    socket.on('message', (message:any) => {
      console.log('📨 Message from client:', message.toString());

      // Example: Broadcast message to all clients
      wss.clients.forEach((client:any) => {
        if (client.readyState === client.OPEN) {
          client.send(message.toString());
        }
      });
    });

    socket.on('close', () => {
      console.log(' Client disconnected');
    });
  });
};

export const getWss = () => wss;
