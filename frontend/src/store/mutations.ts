import { Point } from "@/models";
import { MutationTree } from "vuex";
import { ISvgPath, ISvgSettings } from "web-draw-shared-canvas-shared";
import { State } from ".";

/**
 * To Mutate the State
 */

// Mutation Types
export enum MutationTypes {
  StartDrawing = "START_DRAWING",
  DrawTo = "DRAW_TO",
  EndDrawing = "END_DRAWING",
  UpdateCurrentLineColor = "UPDATE_CURRENT_LINE_COLOR",
  UpdateBackgroundColor = "UPDATE_BACKGROUND_COLOR",

  ClearCanvas = "CLEAR_CANVAS",
  UndoLastLine = "UNDO_LAST_LINE",

  SetClientId = "SET_CLIENT_ID",
  SetAllLines = "SET_ALL_LINES",
  AddLine = "ADD_LINE",
  UpdateLine = "UPDATE_LINE",
  UpdateSettings = "UPDATE_SETTINGS",
}

// Define Mutation Prototypes
export interface Mutations<S = State> {
  [MutationTypes.ClearCanvas](state: S): void;

  [MutationTypes.StartDrawing](state: S, startPoint: Point): void;

  [MutationTypes.DrawTo](state: S, point: Point): void;

  [MutationTypes.EndDrawing](state: S, endPoint: Point): void;

  [MutationTypes.UpdateBackgroundColor](state: S, bgColor: string): void;

  [MutationTypes.UpdateCurrentLineColor](state: S, lineColor: string): void;

  [MutationTypes.UndoLastLine](state: S): void;

  [MutationTypes.SetClientId](state: S, clientId: number): void;

  [MutationTypes.AddLine](state: S, line: ISvgPath): void;

  [MutationTypes.UpdateLine](state: S, line: ISvgPath): void;

  [MutationTypes.SetAllLines](state: S, lines: ISvgPath[]): void;

  [MutationTypes.UpdateSettings](state: S, lines: ISvgSettings): void;
}

// Define Mutations
export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ClearCanvas](state: State) {
    state.currentLine.isDrawing = false;
    state.lines.length = 0; // = [];
  },

  [MutationTypes.StartDrawing](state: State, startPoint: Point) {
    state.currentLine.idClient = state.clientId;
    state.currentLine.idLine = state.lineId++;
    state.currentLine.path += `M${startPoint.x},${startPoint.y} `;
    state.currentLine.createdTime = new Date(Date.now());
    state.currentLine.isDrawing = true;
  },

  [MutationTypes.DrawTo](state: State, point: Point) {
    if (state.currentLine.isDrawing)
      state.currentLine.path += `L${point.x},${point.y} `;
  },

  [MutationTypes.EndDrawing](state: State, endPoint: Point) {
    if (state.currentLine.isDrawing) {
      state.currentLine.path += `L${endPoint.x},${endPoint.y}`;

      state.lines.push({ ...state.currentLine });

      state.currentLine.isDrawing = false;
      state.currentLine.path = "";
    }
  },

  [MutationTypes.UpdateBackgroundColor](state: State, bgColor: string) {
    state.settings.backgroundColor = bgColor;
  },

  [MutationTypes.UpdateCurrentLineColor](state: State, lineColor: string) {
    state.currentLine.strokeColor = lineColor;
  },

  [MutationTypes.UndoLastLine](state: State) {
    state.lines.pop();
  },

  [MutationTypes.SetClientId](state: State, clientId: number) {
    state.clientId = clientId;
  },

  [MutationTypes.SetAllLines](state: State, lines: ISvgPath[]) {
    state.lines.length = lines.length;
    lines.forEach((value, index) => (state.lines[index] = value));
  },

  [MutationTypes.AddLine](state: State, line: ISvgPath) {
    state.lines.push(line);
  },

  [MutationTypes.UpdateLine](state: State, line: ISvgPath) {
    const indexLine = state.lines.findIndex(
      (val) => val.idLine == line.idLine && val.idClient == line.idClient
    );

    if (indexLine == -1) {
      state.lines.push(line);
    } else {
      state.lines[indexLine] = line;
    }
  },

  [MutationTypes.UpdateSettings](state: State, settings: ISvgSettings) {
    state.settings = settings;
  },
};
