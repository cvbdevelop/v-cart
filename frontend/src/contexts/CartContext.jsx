import { createContext, useState, useEffect } from 'react';

// ១. Export CartContext សម្រាប់ហៅប្រើប្រាស់តាមរយៈ useContext
export const CartContext = createContext();

// ២. Export CartProvider សម្រាប់រុំព័ទ្ធ (Wrap) កម្មវិធីទាំងមូលនៅក្នុង App.jsx
export const CartProvider = ({ children }) => {
  // ទាញយកទិន្នន័យកន្ត្រកពី LocalStorage ពេលបើកវេបសាយដំបូង
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('v-cart-items');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // រក្សាទុកកន្ត្រកចូលទៅក្នុង LocalStorage រាល់ពេលមានការផ្លាស់ប្តូរ
  useEffect(() => {
    localStorage.setItem('v-cart-items', JSON.stringify(cart));
  }, [cart]);

  // មុខងារបន្ថែមទំនិញចូលកន្ត្រក
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        // បើមានទំនិញនេះហើយ គ្រាន់តែបូកចំនួនបន្ថែម
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // បើមិនទាន់មាន ដាក់បញ្ចូលទំនិញថ្មី
      return [...prevCart, { ...product, quantity }];
    });
  };

  // មុខងារលុបទំនិញចេញពីកន្ត្រក
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // មុខងារកែប្រែចំនួនទំនិញ (បូក/ដក ចំនួនក្នុងកន្ត្រក)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // មុខងារសម្អាតកន្ត្រក (ប្រើពេលទូទាត់ប្រាក់រួចរាល់)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};