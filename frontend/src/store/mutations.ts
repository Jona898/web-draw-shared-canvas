import { Point } from "@/models";
import { MutationTree } from "vuex";
import { State } from ".";

/**
 * To Mutate the State
 */

// Mutation Types
export enum MutationTypes {
  clearCanvas = "CLEAR_CANVAS",
  StartDrawing = "START_DRAWING",
  DrawTo = "DRAW_TO",
  EndDrawing = "END_DRAWING",
  UpdateBackgroundColor = "UPDATE_BACKGROUND_COLOR",
  UpdateLineColor = "UPDATE_LINE_COLOR",
  UndoLastLine = "UNDO_LAST_LINE",
}

// Define Mutation Prototypes
export interface Mutations<S = State> {
  [MutationTypes.clearCanvas](state: S): void;

  [MutationTypes.StartDrawing](state: S, startPoint: Point): void;

  [MutationTypes.DrawTo](state: S, point: Point): void;

  [MutationTypes.EndDrawing](state: S, endPoint: Point): void;

  [MutationTypes.UpdateBackgroundColor](state: S, bgColor: string): void;

  [MutationTypes.UpdateLineColor](state: S, lineColor: string): void;

  [MutationTypes.UndoLastLine](state: S): void;
}

// Define Mutations
export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.clearCanvas](state: State) {
    state.currentLine.isDrawing = false;
    state.lines.length = 0; // = [];
  },

  [MutationTypes.StartDrawing](state: State, startPoint: Point) {
    state.currentLine.path = `M${startPoint.x},${startPoint.y} `;
    state.currentLine.isDrawing = true;
  },

  [MutationTypes.DrawTo](state: State, point: Point) {
    if (state.currentLine.isDrawing)
      state.currentLine.path += `L${point.x},${point.y} `;
  },

  [MutationTypes.EndDrawing](state: State, endPoint: Point) {
    if (state.currentLine.isDrawing) {
      state.currentLine.path += `L${endPoint.x},${endPoint.y}`;

      state.lines.push({
        id: -1,
        path: state.currentLine.path,
        strokeColor: state.currentLine.strokeColor,
        strokeWidth: state.currentLine.strokeWidth,
        createdTime: new Date(Date.now()),
      });

      state.currentLine.isDrawing = false;
      state.currentLine.path = "";
    }
  },

  [MutationTypes.UpdateBackgroundColor](state: State, bgColor: string) {
    state.settings.backgroundColor = bgColor;
  },

  [MutationTypes.UpdateLineColor](state: State, lineColor: string) {
    state.currentLine.strokeColor = lineColor;
  },

  [MutationTypes.UndoLastLine](state: State) {
    state.lines.pop();
  },
};
