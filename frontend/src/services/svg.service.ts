import { ActionTypes, Store, useStore } from "@/store";
import {
  assertUnreachable,
  ISvgPath,
  ISvgSettings,
  Message,
  MessageNames,
  WsErrorMessage,
} from "web-draw-shared-canvas-shared";

export class SvgWebSocketService {
  // -----------------------------------
  // ---------- Property ----------
  // -----------------------------------

  private socket!: WebSocket;

  private store: Store;

  private connectionSettings: {
    isSecore: boolean;
    host: string;
    port: number;
    path: string;
  };

  private sendLineUpdateTimerId: number | undefined;

  private sendLineUpdateInterval = 1000 / 20;

  // -----------------------------------
  // ---------- Constructor ----------
  // -----------------------------------

  constructor(connectionSettings: {
    isSecore: boolean;
    host: string;
    port: number;
    path: string;
  }) {
    this.connectionSettings = connectionSettings;

    // Get Vuex Store
    this.store = useStore();

    this.connect();

    this.ListenFromStore();
  }

  // -----------------------------------
  // ---------- Setup Connection ----------
  // -----------------------------------

  private connect() {
    // console.log("Start WebSocket Connection");

    // Create a socket instance
    this.socket = new WebSocket(
      `${this.connectionSettings.isSecore ? "wss" : "ws"}://${
        this.connectionSettings.host
      }:${this.connectionSettings.port}/${this.connectionSettings.path}`
    );

    // Open the socket
    this.socket.onopen = (event) => {
      // Log the OnOpenEvent
      console.log(event);

      // Listen for messages
      this.socket.onmessage = this.handleMessage.bind(this);

      // Get the Client Id
      this.sendMsgRecieveClientId();
    };

    // Listen for Errors
    this.socket.onerror = this.handleConnectionError.bind(this);

    // Listen for socket closes
    this.socket.onclose = this.handleConnectionClose.bind(this);
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

    this.socket.close();
  }

  // -----------------------------------
  // ---------- Connection Close ----------
  // -----------------------------------

  private handleConnectionClose(event: CloseEvent) {
    console.log("Client notified socket has closed", event);

    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  // -----------------------------------
  // ---------- Handle Store Changes ----------
  // -----------------------------------

  private ListenFromStore() {
    this.store.subscribeAction({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      before: (action, state) => {
        const actionType = <ActionTypes>action.type;
        switch (actionType) {
          case ActionTypes.ClearCanvas:
            // console.log(`Clear Canvas`);
            this.sendMsgClearCanvas();
            break;

          default:
            break;
        }
      },
      after: (action, state) => {
        const actionType = <ActionTypes>action.type;
        switch (actionType) {
          case ActionTypes.StartDrawing:
            this.sendMsgAddLine(state.currentLine);
            break;

          case ActionTypes.DrawTo:
            if (this.sendLineUpdateTimerId == undefined) {
              this.sendLineUpdateTimerId = setTimeout(
                () => (this.sendLineUpdateTimerId = undefined),
                this.sendLineUpdateInterval
              );
              this.sendMsgUpdateLine(state.currentLine);
            }
            break;

          case ActionTypes.EndDrawing:
            if (
              state.lines[state.lines.length - 1].idClient ==
              this.store.state.clientId
            ) {
              this.sendMsgUpdateLine(state.lines[state.lines.length - 1]);
            }
            break;

          case ActionTypes.UndoLastLine:
            this.sendMsgSetAllLines(state.lines);
            break;

          case ActionTypes.UpdateBackgroundColor:
            this.sendMsgUpdateSettings(state.settings);
            break;

          // Handled in bevore
          case ActionTypes.ClearCanvas:
            break;

          // Takes effekt, if you draw the next line
          case ActionTypes.UpdateCurrentLineColor:
            break;

          // Send from Backend. doesn't need to handle again
          case ActionTypes.SetClientId:
          case ActionTypes.SetAllLines:
          case ActionTypes.AddLine:
          case ActionTypes.UpdateLine:
          case ActionTypes.UpdateSettings:
            break;

          default:
            assertUnreachable(actionType);
            break;
        }
      },
    });
  }

  // -----------------------------------
  // ---------- Handle Message ----------
  // -----------------------------------

  private handleMessage(event: MessageEvent<string>): void {
    // console.log("Client received a message", event.data);

    let data: Message<MessageNames>;

    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.error(err);

      return;
    }

    switch (data.type) {
      case MessageNames.Test:
        this.handleMsgTest(<Message<MessageNames.Test>>data);
        break;

      case MessageNames.UpdateSettings:
        this.handleMsgUpdateSettings(
          <Message<MessageNames.UpdateSettings>>data
        );
        break;

      case MessageNames.AddLine:
        this.handleMsgAddLine(<Message<MessageNames.AddLine>>data);
        break;

      case MessageNames.UpdateLine:
        this.handleMsgUpdateLine(<Message<MessageNames.UpdateLine>>data);
        break;

      case MessageNames.ClientID:
        this.handleMsgRecieveClientId(<Message<MessageNames.ClientID>>data);
        break;

      case MessageNames.ClearCanvas:
        this.handleMsgClearCanvas();
        break;

      case MessageNames.SendAllLines:
        this.handleMsgSendAllLines(<Message<MessageNames.SendAllLines>>data);
        break;

      case MessageNames.Error:
        console.error("Error got from Backend: ", data);
        break;

      // Message only sent to Backend and never revieved
      case MessageNames.GetAllLines:
        break;

      default:
        console.error(`Received message of unknown type: "${data.type}"`);
        assertUnreachable(data.type);
        break;
    }
  }

  // -----------------------------------
  // ---------- TEST ----------
  // -----------------------------------

  public sendMsgTest(payload: string): void {
    this.sendData(<Message<MessageNames.Test>>{
      type: MessageNames.Test,
      payload: payload,
    });
  }

  public handleMsgTest(message: Message<MessageNames.Test>): void {
    console.log(`Received Test Message ${message.payload}`);
  }

  // -----------------------------------
  // ---------- Error Message ----------
  // -----------------------------------

  public sendMsgError(payload: WsErrorMessage): void {
    this.sendData(<Message<MessageNames.Error>>{
      type: MessageNames.Error,
      payload: payload,
    });
  }

  public handleMsgError(message: Message<MessageNames.Error>): void {
    console.error(`Received Error Message ${message.payload}`);
  }

  // -----------------------------------
  // ---------- Update Settings ----------
  // -----------------------------------

  public sendMsgUpdateSettings(payload: ISvgSettings): void {
    this.sendData(<Message<MessageNames.UpdateSettings>>{
      type: MessageNames.UpdateSettings,
      payload: payload,
    });
  }

  public handleMsgUpdateSettings(
    message: Message<MessageNames.UpdateSettings>
  ): void {
    // console.log(`Received UpdateSettings Message ${message.payload}`);
    this.store.dispatch(ActionTypes.UpdateSettings, message.payload);
  }

  // -----------------------------------
  // ---------- All Lines ----------
  // -----------------------------------

  public sendMsgSetAllLines(payload: ISvgPath[]): void {
    this.sendData(<Message<MessageNames.SendAllLines>>{
      type: MessageNames.SendAllLines,
      payload: payload,
    });
  }

  public handleMsgSendAllLines(
    message: Message<MessageNames.SendAllLines>
  ): void {
    // console.log(`Received SendAllLines Message ${message.payload}`);

    this.store.dispatch(ActionTypes.SetAllLines, message.payload);
  }

  // -----------------------------------
  // ---------- Add Line ----------
  // -----------------------------------

  public sendMsgAddLine(payload: ISvgPath): void {
    this.sendData(<Message<MessageNames.AddLine>>{
      type: MessageNames.AddLine,
      payload: payload,
    });
  }

  public handleMsgAddLine(message: Message<MessageNames.AddLine>): void {
    // console.log(`Received AddLine Message ${message.payload}`);

    this.store.dispatch(ActionTypes.AddLine, message.payload);
  }

  // -----------------------------------
  // ---------- Update Line ----------
  // -----------------------------------

  public sendMsgUpdateLine(payload: ISvgPath): void {
    this.sendData(<Message<MessageNames.UpdateLine>>{
      type: MessageNames.UpdateLine,
      payload: payload,
    });
  }

  public handleMsgUpdateLine(message: Message<MessageNames.UpdateLine>): void {
    // console.log(`Received UpdateLine Message ${message.payload}`);

    this.store.dispatch(ActionTypes.UpdateLine, message.payload);
  }

  // -----------------------------------
  // ---------- Recieve Client Id ----------
  // -----------------------------------

  public sendMsgRecieveClientId(): void {
    this.sendData(<Message<MessageNames.ClientID>>{
      type: MessageNames.ClientID,
      payload: undefined,
    });
  }

  public handleMsgRecieveClientId(
    message: Message<MessageNames.ClientID>
  ): void {
    // console.log(`Received ClientId Message ${message.payload}`);
    if (message.payload)
      this.store.dispatch(ActionTypes.SetClientId, message.payload);
  }

  // -----------------------------------
  // ---------- Clear Canvas ----------
  // -----------------------------------

  public sendMsgClearCanvas(): void {
    if (this.store.getters.canUndoLine)
      this.sendData(<Message<MessageNames.ClearCanvas>>{
        type: MessageNames.ClearCanvas,
        payload: undefined,
      });
  }

  public handleMsgClearCanvas(): void {
    // console.log(`Received ClearCanvas Message`);
    this.store.dispatch(ActionTypes.ClearCanvas, undefined);
  }

  // -----------------------------------
  // ---------- ????? ----------
  // -----------------------------------
}
