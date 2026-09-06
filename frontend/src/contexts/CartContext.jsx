import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // បន្ថែមទំនិញ
  const addToCart = (product) => {
  setCartItems((prevItems) => {
    // ពិនិត្យមើលថាតើទំនិញដែលមាន ID, ទំហំ និងពណ៌ដូចគ្នា មានរួចហើយឬនៅ
    const existingIndex = prevItems.findIndex(
      (item) => 
        (item._id === product._id || item.id === product.id) &&
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
    );

    if (existingIndex > -1) {
      //បើមានហើយ បន្ថែមចំនួន (quantity) ជំនួសការបង្កើតថ្មី
      const newItems = [...prevItems];
      newItems[existingIndex].quantity += (product.quantity || 1);
      return newItems;
    } else {
      // បើមិនទាន់មាន បន្ថែមចូលថ្មី
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    }
  });
};

  // ដកទំនិញចេញ
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // កែប្រែចំនួន (បូក/ដក)
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  // លុបកន្ត្រកពេលទូទាត់រួច
  const clearCart = () => {
    setCart([]);
  };

  // គណនាចំនួន និងតម្លៃ
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);