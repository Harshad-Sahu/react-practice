const initialState = {
  cart: [],
};

export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ITEMS":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "REMOVE_ITEMS":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};
