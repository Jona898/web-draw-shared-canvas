import * as ws_WebSocket from "ws";
import { CLOSED, CLOSING } from "ws";

export abstract class MessageServer<T> {
  constructor(private readonly wsServer: ws_WebSocket.Server) {
    this.wsServer.on("connection", this.subscribeToMessages);
    this.wsServer.on("error", this.cleanupDeadClients);
  }

  protected abstract handleMessage(sender: ws_WebSocket, message: T): void;

  protected readonly subscribeToMessages = (ws: ws_WebSocket): void => {
    ws.on("message", (data: ws_WebSocket.Data) => {
      if (typeof data === "string") {
        this.handleMessage(ws, JSON.parse(data));
      } else {
        console.log("Received data of unsupported type.");
      }
    });
  };

  private readonly cleanupDeadClients = (): void => {
    this.wsServer.clients.forEach((client) => {
      if (this.isDead(client)) {
        this.wsServer.clients.delete(client);
      }
    });
  };

  protected broadcastExcept(
    currentClient: ws_WebSocket,
    message: Readonly<T>
  ): void {
    this.wsServer.clients.forEach((client) => {
      if (client !== currentClient && this.isAlive(client)) {
        client.send(JSON.stringify(message));
      }
    });
  }

  protected broadcastAll(message: Readonly<T>): void {
    // let clients1: string[] = [];
    // let clients2: string[] = [];

    // this.wsServer.clients.forEach((value, value2, set) => {
    //   clients1.push(JSON.stringify(value));
    //   clients2.push(JSON.stringify(value2));
    // });

    // console.log(`const clients1= [${clients1.join(",")}]`);
    // console.log(`const clients2= [${clients2.join(",")}]`);

    this.wsServer.clients.forEach((client) => {
      if (this.isAlive(client)) {
        client.send(JSON.stringify(message));
      }
    });
  }

  protected replyTo(client: ws_WebSocket, message: Readonly<T>): void {
    client.send(JSON.stringify(message));
  }

  protected get clients(): Set<import("ws")> {
    return this.wsServer.clients;
  }

  private isAlive(client: import("ws")): boolean {
    return !this.isDead(client);
  }

  private isDead(client: import("ws")): boolean {
    return client.readyState === CLOSING || client.readyState === CLOSED;
  }
}
