import { Message, MessageNames, MessageTypes } from "shared";
import * as ws_WebSocket from "ws";
import { MessageServer } from "./";

export class SvgWebSocketServer extends MessageServer<Message<MessageNames>> {
  private _nextClientId = 1;

  public get nextClientId(): number {
    return this._nextClientId++;
  }

  protected handleMessage(
    sender: ws_WebSocket,
    message: Message<MessageNames>
  ): void {
    console.log("Recieved Message: ", message);

    switch (message.type) {
      case MessageNames.Test:
        this.handleTest(sender, message as Message<MessageNames.Test>);
        break;

      case MessageNames.GetClientID:
        this.handleGetClientId(
          sender,
          message as Message<MessageNames.GetClientID>
        );
        break;

      case MessageNames.UpdateLastLine:
        this.handleUpdateLastLine(
          sender,
          message as Message<MessageNames.UpdateLastLine>
        );
        break;

      case MessageNames.UpdateSettings:
        this.handleUpdateSettings(
          sender,
          message as Message<MessageNames.UpdateSettings>
        );
        break;

      case MessageNames.Error:
        this.handleError(sender, message as Message<MessageNames.Error>);
        break;

      default:
        console.error(`Received message of unknown type: "${message.type}"`);
        this.replyTo(sender, {
          correlationId: "Error",
          type: MessageNames.Error,
          payload: {
            title: `Type ${message.type} could not be evaluated`,
            message: `Handler for Message Type is not defined in Backend`,
          },
        } as Message<MessageNames.Error>);
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

    this.broadcastExcept(sender, updatedMessage);
    this.replyTo(sender, updatedMessage);
  }

  private handleGetClientId(
    sender: ws_WebSocket,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: Message<MessageNames.GetClientID>
  ) {
    this.replyTo(sender, {
      type: MessageNames.SendClientID,
      payload: this.nextClientId,
    } as Message<MessageNames.SendClientID>);
  }

  private handleUpdateLastLine(
    sender: ws_WebSocket,
    message: Message<MessageNames.UpdateLastLine>
  ): void {
    this.broadcastExcept(sender, message);
  }

  private handleUpdateSettings(
    sender: ws_WebSocket,
    message: Message<MessageNames.UpdateSettings>
  ): void {
    this.broadcastExcept(sender, message);
  }

  private handleError(
    requestor: ws_WebSocket,
    message: Message<MessageNames.Error>
  ): void {
    console.error(message, new Error().name);
    // this.broadcastExcept(requestor, message);
  }
}
