import { ISvgPath, ISvgSettings } from "..";
import { WsErrorMessage } from "./ErrorMessage";

export enum MessageNames {
  Error = "ERROR",
  Test = "TEST",
  clientID = "CLIENT_ID",
  UpdateLastLine = "UPDATE_LAST_LINE",
  UpdateSettings = "UPDATE_SETTINGS",
}

type MessageGeneric = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in MessageNames]: any;
};

export interface MessageTypes extends MessageGeneric {
  [MessageNames.Error]: WsErrorMessage;
  [MessageNames.Test]: string;
  [MessageNames.UpdateSettings]: ISvgSettings;
  [MessageNames.UpdateLastLine]: ISvgPath;
  [MessageNames.clientID]: number | undefined;
}

export interface Message<T extends keyof MessageTypes> {
  type: T;
  payload: MessageTypes[T];
}
