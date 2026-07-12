/* eslint-disable react/prop-types */
import React, { createContext, useReducer } from "react";
import { cartReducer, initialState } from "./reducer.js";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <cartContext.Provider value={{ state, dispatch }}>
      {children}
    </cartContext.Provider>
  );
};

export function useCart() {
  const context = React.useContext(cartContext);
  if (!context) {
    throw new Error("useCart must be used inside Provider");
  }
  return context;
}
