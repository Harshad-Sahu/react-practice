import { createStore } from "redux";
import { CartReducer } from "./reduxReducer";

export const store = createStore(CartReducer);
