import { ADD_ITEMS, REMOVE_ITEMS } from "./reduxActionTypes";

export const addItems = (items) => ({
  type: ADD_ITEMS,
  payload: items,
});

export const removeItems = (items) => ({
  type: REMOVE_ITEMS,
  payload: items,
});
