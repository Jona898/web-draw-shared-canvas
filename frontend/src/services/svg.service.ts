import {
  ISvgPath,
  ISvgSettings,
  Message,
  MessageNames,
  WsErrorMessage,
} from "shared";

export class SvgWebSocketService {
  // -----------------------------------
  // ---------- Property ----------
  // -----------------------------------

  private socket: WebSocket;

  // -----------------------------------
  // ---------- Constructor ----------
  // -----------------------------------

  constructor(host: string, port: number, path: string) {
    // Create a socket instance
    this.socket = new WebSocket(`ws://${host}:${port}/${path}`);

    // Open the socket
    this.socket.onopen = event => {
      // Log the OnOpenEvent
      console.log(event);

      // Listen for messages
      this.socket.onmessage = this.handleMessage.bind(this);

      // Listen for Errors
      this.socket.onerror = this.handleConnectionError.bind(this);

      // Listen for socket closes
      this.socket.onclose = this.handleConnectionClose.bind(this);

      // Send an initial message
      this.sendData({
        type: MessageNames.Test,
        payload: "I am the client and I'm listening!",
      });
    };
  }

  // -----------------------------------
  // ---------- Send Data ----------
  // -----------------------------------

  private sendData(data: Message<MessageNames>) {
    this.socket.send(JSON.stringify(data));
  }

  // -----------------------------------
  // ---------- Connection Error ----------
  // -----------------------------------

  private handleConnectionError(event: Event) {
    console.log("WebSocket Error: ", event);
  }

  // -----------------------------------
  // ---------- Connection Close ----------
  // -----------------------------------

  private handleConnectionClose(event: CloseEvent) {
    console.log("Client notified socket has closed", event);
  }

  // -----------------------------------
  // ---------- Handle Message ----------
  // -----------------------------------

  private handleMessage(event: MessageEvent<string>): void {
    console.log("Client received a message", event.data);

    let data: Message<MessageNames>;

    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.error(err);

      return;
    }

    switch (data.type) {
      case MessageNames.Test:
        console.log(data);
        this.handleMsgTest(data as Message<MessageNames.Test>);
        break;

      case MessageNames.UpdateLastLine:
        this.handleMsgUpdateLastLine(
          data as Message<MessageNames.UpdateLastLine>
        );
        break;

      case MessageNames.UpdateSettings:
        this.handleMsgUpdateSettings(
          data as Message<MessageNames.UpdateSettings>
        );
        break;

      default:
        console.error(`Received message of unknown type: "${data.type}"`);
        break;
    }
  }

  // -----------------------------------
  // ---------- TEST ----------
  // -----------------------------------

  public sendMsgTest(payload: string) {
    this.sendData({
      type: MessageNames.Test,
      payload: payload,
    } as Message<MessageNames.Test>);
  }

  public handleMsgTest(message: Message<MessageNames.Test>): void {
    console.log(`Received Test Message ${message.payload}`);
  }

  // -----------------------------------
  // ---------- Update Settings ----------
  // -----------------------------------

  public sendMsgUpdateSettings(payload: ISvgSettings) {
    this.sendData({
      type: MessageNames.UpdateSettings,
      payload: payload,
    } as Message<MessageNames.UpdateSettings>);
  }

  public handleMsgUpdateSettings(
    message: Message<MessageNames.UpdateSettings>
  ): void {
    console.log(`Received UpdateSettings Message ${message.payload}`);
  }

  // -----------------------------------
  // ---------- Update Last Line ----------
  // -----------------------------------

  public sendMsgUpdateLastLine(payload: ISvgPath) {
    this.sendData({
      type: MessageNames.UpdateLastLine,
      payload: payload,
    } as Message<MessageNames.UpdateLastLine>);
  }

  public handleMsgUpdateLastLine(
    message: Message<MessageNames.UpdateLastLine>
  ): void {
    console.log(`Received UpdateLastLine Message ${message.payload}`);
  }

  // -----------------------------------
  // ---------- Error Message ----------
  // -----------------------------------

  public sendMsgError(payload: WsErrorMessage) {
    this.sendData({
      type: MessageNames.Error,
      payload: payload,
    } as Message<MessageNames.Error>);
  }

  public handleMsgError(message: Message<MessageNames.Error>): void {
    console.log(`Received Error Message ${message.payload}`);
  }

  // -----------------------------------
  // ---------- ????? ----------
  // -----------------------------------
}
