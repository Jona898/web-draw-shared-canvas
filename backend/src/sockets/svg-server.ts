import {
  assertUnreachable,
  ISvgPath,
  ISvgSettings,
  Message,
  MessageNames,
  MessageTypes,
} from "web-draw-shared-canvas-shared";
import * as ws_WebSocket from "ws";
import { MessageServer } from ".";

export class SvgWebSocketServer extends MessageServer<Message<MessageNames>> {
  private _nextClientId;

  public get nextClientId(): number {
    return this._nextClientId++;
  }

  private allSvgLines: ISvgPath[];
  private svgSettings: ISvgSettings;

  constructor(wsServer: ws_WebSocket.Server) {
    super(wsServer);

    this._nextClientId = 1;
    this.allSvgLines = [];
    this.svgSettings = {
      title: "Freehand SVG Draw",
      backgroundColor: "#EAEAEA",
    };
  }

  protected onStartConnection(socket: ws_WebSocket): void {
    // Send the Start Data after 0.2s
    setTimeout(() => {
      this.handleGetAllLines(socket);
      this.handleSendSettings(socket);
    }, 200);
  }

  protected handleMessage(
    sender: ws_WebSocket,
    message: Message<MessageNames>
  ): void {
    // console.log("Recieved Message: ", message);

    switch (message.type) {
      case MessageNames.Test:
        this.handleTest(sender, <Message<MessageNames.Test>>message);
        break;

      case MessageNames.ClientID:
        this.handleGetClientId(sender);
        break;

      case MessageNames.AddLine:
        this.handleAddLine(sender, <Message<MessageNames.AddLine>>message);
        break;

      case MessageNames.UpdateLine:
        this.handleUpdateLine(
          sender,
          <Message<MessageNames.UpdateLine>>message
        );
        break;

      case MessageNames.UpdateSettings:
        this.handleUpdateSettings(
          sender,
          <Message<MessageNames.UpdateSettings>>message
        );
        break;

      case MessageNames.ClearCanvas:
        this.handleClearCanvas(
          sender,
          <Message<MessageNames.ClearCanvas>>message
        );
        break;

      case MessageNames.Error:
        this.handleError(sender, <Message<MessageNames.Error>>message);
        break;

      case MessageNames.SendAllLines:
        this.handleSendAllLines(
          sender,
          <Message<MessageNames.SendAllLines>>message
        );
        break;

      case MessageNames.GetAllLines:
        this.handleGetAllLines(sender);
        break;

      default:
        console.error(`Received message of unknown type: "${message.type}"`);
        this.replyTo(sender, <Message<MessageNames.Error>>{
          correlationId: "Error",
          type: MessageNames.Error,
          payload: {
            title: `Type ${message.type} could not be evaluated`,
            message: `Handler for Message Type is not defined in Backend`,
          },
        });
        assertUnreachable(message.type);
        break;
    }
  }

  private handleTest(
    sender: ws_WebSocket,
    message: Message<MessageNames.Test>
  ): void {
    const updatedMessage: Message<MessageNames.Test> = {
      type: MessageNames.Test,
      payload: <MessageTypes[MessageNames.Test]>(
        `Recieved Mesage '${message.payload}' from client '${sender.url}'`
      ),
    };

    this.replyTo(sender, updatedMessage);
  }

  private handleGetClientId(sender: ws_WebSocket) {
    this.replyTo(sender, <Message<MessageNames.ClientID>>{
      type: MessageNames.ClientID,
      payload: this.nextClientId,
    });
  }

  private handleAddLine(
    sender: ws_WebSocket,
    message: Message<MessageNames.AddLine>
  ): void {
    this.allSvgLines.push(message.payload);
    this.broadcastExcept(sender, message);
  }

  private handleUpdateLine(
    sender: ws_WebSocket,
    message: Message<MessageNames.UpdateLine>
  ): void {
    const indexLine = this.allSvgLines.findIndex(
      (val) =>
        val.idLine == message.payload.idLine &&
        val.idClient == message.payload.idClient
    );

    if (indexLine == -1) {
      this.allSvgLines.push(message.payload);
    } else {
      this.allSvgLines[indexLine] = message.payload;
    }

    this.broadcastExcept(sender, message);
  }

  private handleUpdateSettings(
    sender: ws_WebSocket,
    message: Message<MessageNames.UpdateSettings>
  ): void {
    this.svgSettings = { ...this.svgSettings, ...message.payload };

    this.broadcastExcept(sender, message);
  }

  private handleSendSettings(sender: ws_WebSocket): void {
    this.replyTo(sender, <Message<MessageNames.UpdateSettings>>{
      type: MessageNames.UpdateSettings,
      payload: this.svgSettings,
    });
  }

  private handleClearCanvas(
    sender: ws_WebSocket,
    message: Message<MessageNames.ClearCanvas>
  ): void {
    this.allSvgLines = [];
    this.broadcastExcept(sender, message);
  }

  private handleSendAllLines(
    sender: ws_WebSocket,
    message: Message<MessageNames.SendAllLines>
  ): void {
    this.allSvgLines = message.payload;

    this.broadcastExcept(sender, message);
  }

  private handleGetAllLines(sender: ws_WebSocket): void {
    this.replyTo(sender, <Message<MessageNames.SendAllLines>>{
      type: MessageNames.SendAllLines,
      payload: this.allSvgLines,
    });
  }

  private handleError(
    requestor: ws_WebSocket,
    message: Message<MessageNames.Error>
  ): void {
    console.error(message, new Error().stack);
  }
}
