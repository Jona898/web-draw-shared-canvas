import { ISvgPath, ISvgSettings } from "..";
import { WsErrorMessage } from "./ErrorMessage";

export enum MessageNames {
  Error = "ERROR",

  Test = "TEST",

  ClientID = "CLIENT_ID",

  AddLine = "ADD_LINE",
  UpdateLine = "UPDATE_LINE",
  SendAllLines = "SEND_ALL_LINES",
  GetAllLines = "GET_ALL_LINES",

  UpdateSettings = "UPDATE_SETTINGS",

  ClearCanvas = "CLEAR_CANVAS",
}

type MessageGeneric = {
  [key in MessageNames]: unknown;
};

export interface MessageTypes extends MessageGeneric {
  [MessageNames.Error]: WsErrorMessage;

  [MessageNames.Test]: string;

  [MessageNames.ClientID]: number | undefined;

  [MessageNames.AddLine]: ISvgPath;
  [MessageNames.UpdateLine]: ISvgPath;
  [MessageNames.SendAllLines]: ISvgPath[];
  [MessageNames.GetAllLines]: undefined;

  [MessageNames.UpdateSettings]: ISvgSettings;

  [MessageNames.ClearCanvas]: undefined;
}

export interface Message<T extends keyof MessageTypes> {
  type: T;
  payload: MessageTypes[T];
}
