import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  const incQty = () => {
    setQty(qty + 1);
  };

  const decQty = () => {
    setQty(() => {
      if (qty - 1 < 1) return 1;

      return qty - 1;
    });
  };

  const resetQty = () => {
    setQty(1);
  };

  const addToCart = (product, quantity) => {
    const isProductInCart = cartItems.find(item => item._id === product._id);

    if (isProductInCart) {
      const updatedCartItems = cartItems.map(cartProduct => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }

    setTotalPrice(totalPrice + product.price * quantity);
    setTotalQuantities(totalQuantities + quantity);

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const removeFromCart = index => {
    setTotalPrice(
      totalPrice - cartItems[index].price * cartItems[index].quantity
    );
    setTotalQuantities(totalQuantities - cartItems[index].quantity);
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const toggleCartItemQuantity = (index, action) => {
    let updatedCartItems = [...cartItems];

    if (action === 'INC') {
      updatedCartItems[index].quantity += 1;
      setTotalPrice(totalPrice + updatedCartItems[index].price);
      setTotalQuantities(totalQuantities + 1);
    } else if (action === 'DEC') {
      if (updatedCartItems[index].quantity > 1) {
        updatedCartItems[index].quantity -= 1;
        setTotalPrice(totalPrice - updatedCartItems[index].price);
        setTotalQuantities(totalQuantities - 1);
      }
    }

    setCartItems(updatedCartItems);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        setShowCart,
        incQty,
        decQty,
        resetQty,
        addToCart,
        toggleCartItemQuantity,
        removeFromCart,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useStateContext = () => useContext(Context);

export default useStateContext;
