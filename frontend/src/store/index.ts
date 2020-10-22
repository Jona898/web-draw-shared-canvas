import { ISvgPath, ISvgSettings } from "web-draw-shared-canvas-shared";
import {
  CommitOptions,
  createLogger,
  createStore,
  DispatchOptions,
  Store as VuexStore,
} from "vuex";
import { Actions, actions, ActionTypes } from "./actions";
import { Getters, getters } from "./getters";
import { Mutations, mutations, MutationTypes } from "./mutations";

// Declare State
type State = {
  clientId: number;
  lineId: number;

  settings: ISvgSettings;

  lines: ISvgPath[];

  currentLine: ISvgPath & {
    isDrawing: boolean;
  };
};

// Set State
const state: State = {
  clientId: -1,
  lineId: 1,

  settings: {
    title: "Freehand SVG Draw",
    backgroundColor: "#EAEAEA",
  },

  lines: [],

  currentLine: {
    idClient: -1,
    idLine: -1,
    createdTime: new Date(0),
    path: "",
    strokeColor: "#292929",
    strokeWidth: 8,
    isDrawing: false,
  },
};

// setup Store Type
type Store = Omit<VuexStore<State>, "commit" | "getters" | "dispatch"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

const store: Store = createStore({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
  strict: true,
});

function useStore(): Store {
  return store;
}

export { MutationTypes, ActionTypes, Store, State, useStore };
