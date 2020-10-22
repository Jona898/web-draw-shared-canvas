import { Mutations, MutationTypes } from "./mutations";
import { ActionContext, ActionTree } from "vuex";
import { State } from ".";
import { Point } from "@/models";
import { ISvgPath } from "web-draw-shared-canvas-shared";

/*
 * For Asynchronus Mutations.
 */

// Action Types
export enum ActionTypes {
  clearCanvas = "CLEAR_CANVAS",
  StartDrawing = "START_DRAWING",
  DrawTo = "DRAW_TO",
  EndDrawing = "END_DRAWING",
  UpdateBackgroundColor = "UPDATE_BACKGROUND_COLOR",
  UpdateLineColor = "UPDATE_LINE_COLOR",
  UndoLastLine = "UNDO_LAST_LINE",
  SetClientId = "SET_CLIENT_ID",
  SetAllLines = "SET_ALL_LINES",
  AddLine = "ADD_LINE",
  UpdateLine = "UPDATE_LINE",
}

// Actions interface
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

// define Action Prototypes
export interface Actions {
  [ActionTypes.clearCanvas]({ commit }: AugmentedActionContext): void;

  [ActionTypes.StartDrawing](
    { commit }: AugmentedActionContext,
    startPoint: Point
  ): void;

  [ActionTypes.DrawTo]({ commit }: AugmentedActionContext, point: Point): void;

  [ActionTypes.EndDrawing](
    { commit }: AugmentedActionContext,
    endPoint: Point
  ): void;

  [ActionTypes.UpdateBackgroundColor](
    { commit }: AugmentedActionContext,
    bgColor: string
  ): void;

  [ActionTypes.UpdateLineColor](
    { commit }: AugmentedActionContext,
    lineColor: string
  ): void;

  [ActionTypes.UndoLastLine]({ commit }: AugmentedActionContext): void;

  [ActionTypes.SetClientId](
    { commit }: AugmentedActionContext,
    clientId: number
  ): void;

  [ActionTypes.AddLine](
    { commit }: AugmentedActionContext,
    line: ISvgPath
  ): void;

  [ActionTypes.UpdateLine](
    { commit }: AugmentedActionContext,
    line: ISvgPath
  ): void;

  [ActionTypes.SetAllLines](
    { commit }: AugmentedActionContext,
    lines: ISvgPath[]
  ): void;
}

// define Actions
export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.clearCanvas]({ commit }) {
    commit(MutationTypes.clearCanvas, undefined);
  },

  [ActionTypes.StartDrawing]({ commit }, startPoint: Point) {
    commit(MutationTypes.StartDrawing, startPoint);
  },

  [ActionTypes.DrawTo]({ commit }, point: Point) {
    commit(MutationTypes.DrawTo, point);
  },

  [ActionTypes.EndDrawing]({ commit }, endPoint: Point) {
    commit(MutationTypes.EndDrawing, endPoint);
  },

  [ActionTypes.UpdateBackgroundColor]({ commit }, bgColor: string) {
    commit(MutationTypes.UpdateBackgroundColor, bgColor);
  },

  [ActionTypes.UpdateLineColor]({ commit }, lineColor: string) {
    commit(MutationTypes.UpdateLineColor, lineColor);
  },

  [ActionTypes.UndoLastLine]({ commit }) {
    commit(MutationTypes.UndoLastLine, undefined);
  },

  [ActionTypes.SetClientId]({ commit }, clientId: number) {
    commit(MutationTypes.SetClientId, clientId);
  },

  [ActionTypes.AddLine]({ commit }, line: ISvgPath) {
    commit(MutationTypes.AddLine, line);
  },

  [ActionTypes.UpdateLine]({ commit }, line: ISvgPath) {
    commit(MutationTypes.UpdateLine, line);
  },

  [ActionTypes.SetAllLines]({ commit }, lines: ISvgPath[]) {
    commit(MutationTypes.SetAllLines, lines);
  },
};
