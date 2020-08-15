import React, { createContext, useState, useCallback, useContext } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  quantity: number;
}

interface CartContextState {
  cart: Product[];
  quantity: number;
  paymentMethod: string;
  choosePayment(payment: string): void;
  incrementQuantity(id: string): void;
  decrementQuantity(id: string): void;
  removeFromCart(id: string, quantity: number): void;
  addToCart(product: Product): void;
  cleanCart(): void;
}

const CartContext = createContext<CartContextState>({} as CartContextState);

export const CartProvider: React.FC = ({ children }) => {
  const [productsCart, setProductsCart] = useState<Product[]>(() => {
    const productsInCart = localStorage.getItem('@Higuga:cartProducts');

    if (productsInCart && JSON.parse(productsInCart).length > 0) {
      return JSON.parse(productsInCart);
    }

    return [];
  });

  const [cartQuantity, setCartQuantity] = useState(() => {
    const quantityInCart = localStorage.getItem('@Higuga:cartQuantity');

    if (quantityInCart && Number(quantityInCart) > 0) {
      return Number(quantityInCart);
    }
    return 0;
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const payment = localStorage.getItem('@Higuga:paymentMethod');

    if (payment && payment !== '') {
      return payment;
    }
    return '';
  });

  const choosePayment = useCallback((payment: string) => {
    setPaymentMethod(payment);
    localStorage.setItem('@Higuga:paymentMethod', payment);
  }, []);

  const incrementQuantity = useCallback(
    (id: string) => {
      let incremented = true;
      const updatedProducts = productsCart.map((p) => {
        if (p.id === id) {
          if (p.stock < p.quantity + 1) {
            incremented = false;
            return p;
          }
          const updateProduct = p;
          updateProduct.quantity += 1;
          return updateProduct;
        }
        return p;
      });

      let newQuantity = cartQuantity;
      if (incremented) {
        setProductsCart(updatedProducts);
        newQuantity += 1;
        setCartQuantity(newQuantity);

        localStorage.setItem(
          '@Higuga:cartProducts',
          JSON.stringify(updatedProducts),
        );
        localStorage.setItem('@Higuga:cartQuantity', String(newQuantity));
      }
    },
    [productsCart, cartQuantity],
  );

  const decrementQuantity = useCallback(
    (id: string) => {
      let decremented = true;
      const updatedProducts = productsCart.map((p) => {
        if (p.id === id) {
          if (p.quantity - 1 < 1) {
            decremented = false;
            return p;
          }
          const updateProduct = p;
          updateProduct.quantity -= 1;
          return updateProduct;
        }
        return p;
      });

      let newQuantity = cartQuantity;
      if (decremented) {
        setProductsCart(updatedProducts);
        newQuantity -= 1;
        setCartQuantity(newQuantity);

        localStorage.setItem(
          '@Higuga:cartProducts',
          JSON.stringify(updatedProducts),
        );
        localStorage.setItem('@Higuga:cartQuantity', String(newQuantity));
      }
    },
    [productsCart, cartQuantity],
  );

  const cleanCart = useCallback(() => {
    setProductsCart([]);
    setCartQuantity(0);
    setPaymentMethod('');

    localStorage.removeItem('@Higuga:cartProducts');
    localStorage.removeItem('@Higuga:cartQuantity');
    localStorage.removeItem('@Higuga:paymentMethod');
  }, []);

  const removeFromCart = useCallback(
    (id: string, quantity: number) => {
      const products = productsCart.filter((p) => p.id !== id);
      let newQuantity = cartQuantity;
      newQuantity -= quantity;
      setProductsCart(products);
      setCartQuantity(newQuantity);

      localStorage.setItem('@Higuga:cartProducts', JSON.stringify(products));
      localStorage.setItem('@Higuga:cartQuantity', String(newQuantity));

      if (products.length === 0) {
        setPaymentMethod('');
        localStorage.removeItem('@Higuga:paymentMethod');
      }
    },
    [productsCart, cartQuantity],
  );

  const addToCart = useCallback(
    (product: Product) => {
      if (product.quantity === 0) return;

      const foundProduct = productsCart.find((p) => p.id === product.id);

      let newQuantity = cartQuantity;

      if (!foundProduct) {
        setProductsCart((oldState) => [...oldState, product]);
        newQuantity += product.quantity;
        setCartQuantity(newQuantity);

        const updatedProducts = productsCart;
        updatedProducts.push(product);

        localStorage.setItem(
          '@Higuga:cartProducts',
          JSON.stringify(updatedProducts),
        );
        localStorage.setItem('@Higuga:cartQuantity', String(newQuantity));

        return;
      }

      if (foundProduct.stock < foundProduct.quantity + product.quantity) {
        return;
      }

      const updatedProducts = productsCart.map((p) => {
        if (p.id === product.id) {
          const updateProduct = p;
          updateProduct.quantity += product.quantity;
          return updateProduct;
        }
        return p;
      });

      setProductsCart(updatedProducts);
      newQuantity += product.quantity;
      setCartQuantity(newQuantity);

      localStorage.setItem(
        '@Higuga:cartProducts',
        JSON.stringify(updatedProducts),
      );
      localStorage.setItem('@Higuga:cartQuantity', String(newQuantity));
    },
    [productsCart, cartQuantity],
  );

  return (
    <CartContext.Provider
      value={{
        cart: productsCart,
        quantity: cartQuantity,
        paymentMethod,
        choosePayment,
        addToCart,
        removeFromCart,
        cleanCart,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextState {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within an AuthProvider');
  }

  return context;
}
