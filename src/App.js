import React, { createContext, useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetch('https://my.api.mockaroo.com/item.json?key=0813c8e0')
      .then(response => response.json())
      .then(data => {
        setCartItems(data)
      })
      .catch(error => console.log('Error fetching data: ', error));
  }, []);

  useEffect(() => {
    let quantity = 0;
    let amount = 0;

    cartItems.forEach(item => {
      quantity += item.quantity;
      amount += item.price * item.quantity;
    });

    setTotalQuantity(quantity);
    setTotalAmount(amount);
  }, [cartItems]);

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const deleteItem = (id) => {
    const data = cartItems.filter(item => item.id !== id)
    return setCartItems(data)
  }

  return (
    <CartContext.Provider value={{ cartItems, totalQuantity, totalAmount, increaseQuantity, decreaseQuantity, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
};


const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CartPage = () => {
  const { cartItems, totalQuantity, totalAmount, increaseQuantity, decreaseQuantity, deleteItem } = useCart();

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Cart Page</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} >
              <td><div className='d-flex flex-column'>
                <img src={item.image} width={50} height={50} />
                <small className='lead' >{item.name}</small>
              </div></td>
              <td>${item.price}</td>
              <td>
                <div className='d-flex gap-2 align-items-center' >
                  <button className="btn btn-sm btn-secondary mr-2" onClick={() => decreaseQuantity(item.id)}>-</button>
                  {item.quantity}
                  <button className="btn btn-sm btn-secondary ml-2" onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td><button className="btn btn-sm btn-danger" onClick={() => deleteItem(item.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div className='d-flex justify-content-between align-item-center ' >
        <h5>Subtotal</h5>
        <h5 className='lead' >${totalAmount.toFixed(2)}</h5>
      </div>
      <div className='d-flex justify-content-between align-item-center ' >
        <h5>Shopping </h5>
        <h5 className='lead'>Free</h5>
      </div>
      <hr />
      <div className='d-flex justify-content-between align-item-center ' >
        <h5>Total Quantity</h5>
        <h5 className='lead' >${totalAmount.toFixed(2)}</h5>
      </div>
    </div >
  );
};

const App = () => {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
};

export default App;
