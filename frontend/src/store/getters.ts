import { State } from ".";
import { GetterTree } from "vuex";

// Getters Types
export type Getters = {
  getTitle: (state: State) => string;

  getCurrentLine: (state: State) => State["currentLine"];

  canUndoLine: (state: State) => boolean;
};

// Getters
export const getters: GetterTree<State, State> & Getters = {
  getTitle: (state) => {
    return state.settings.title;
  },

  getCurrentLine: (state) => {
    return state.currentLine;
  },

  canUndoLine: (state) => {
    return state.lines.length > 0;
  },
};
