import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {      
      const stock = await api.get(`stock/${productId}`);
      const newCart = [...cart]

      const productExist = cart.find(product => product.id === productId)

      const stockAmount: number = stock.data.amount;
      const cartAmount = productExist ? productExist.amount : 0;
      const hasInStock = stockAmount >= cartAmount;
      const amount = cartAmount + 1;


      if(!hasInStock) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productExist) {
        productExist.amount = amount;
      } else {
        const product = await api.get(`products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1
        }

        newCart.push(newProduct);
      }

      setCart(newCart);
      
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
