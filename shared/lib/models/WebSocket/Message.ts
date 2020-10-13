import { ISvgPath, ISvgSettings } from "..";
import { WsErrorMessage } from "./ErrorMessage";

export enum MessageNames {
  Error = "ERROR",
  Test = "TEST",
  GetClientID = "GET_CLIENT_ID",
  SendClientID = "SEND_CLIENT_ID",
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
  [MessageNames.GetClientID]: void;
  [MessageNames.SendClientID]: number;
}

export interface Message<T extends keyof MessageTypes> {
  type: T;
  payload: MessageTypes[T];
}
