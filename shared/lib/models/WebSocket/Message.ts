import { ISvgPath, ISvgSettings } from "..";
import { WsErrorMessage } from "./ErrorMessage";

export enum MessageNames {
  Error = "ERROR",
  Test = "TEST",
  UpdateLastLine = "UPDATE_LAST_LINE",
  UpdateSettings = "UPDATE_SETTINGS",
}

type MessageGeneric = {
  [key in MessageNames]: any;
};

export interface MessageTypes extends MessageGeneric {
  [MessageNames.Error]: WsErrorMessage;
  [MessageNames.Test]: string;
  [MessageNames.UpdateSettings]: ISvgSettings;
  [MessageNames.UpdateLastLine]: ISvgPath;
}

// export interface Message {
//   correlationId: string;
//   type: MessageNames;
//   payload?: MessageTypes[Message["type"]];
// }

export interface Message<T extends keyof MessageTypes> {
  type: T;
  payload: MessageTypes[T];
}

// const message: Message<MessageNames> = {
//   correlationId:"fdsaijfds"
//   type: MessageNames.Test,
//   payload: "S",
// };
