import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // ទាញយកទិន្នន័យកន្ត្រកពី Local Storage បើមាន
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('v-cart-items');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // រក្សាទុកទិន្នន័យទៅ Local Storage ពេលមានការប្រែប្រួល
  useEffect(() => {
    localStorage.setItem('v-cart-items', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => 
          (item._id === product._id || item.id === product.id) &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += (product.quantity || 1);
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prev) => prev.filter(item => 
      !( (item.id === id || item._id === id) && item.selectedSize === size && item.selectedColor === color )
    ));
  };

  const updateQuantity = (id, quantity, size, color) => {
    setCartItems((prev) => prev.map(item => {
      if ((item.id === id || item._id === id) && item.selectedSize === size && item.selectedColor === color) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    }));
  };

  return (
    // យើងបញ្ជូនទាំង cartItems និង cart ដើម្បីការពារ Error ពី Component ផ្សេងៗ
    <CartContext.Provider value={{ cartItems, cart: cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);