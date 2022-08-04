import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import { getProducts } from './dataService';
import { useEffect, useState } from 'react';

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places



const Product = ({ id, name, availableCount, price, orderedQuantity, total, addQuantity, removeQuantity }) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button onClick={() => addQuantity(id)} className={styles.actionButton} disabled={orderedQuantity >= availableCount}>+</button>
        <button onClick={() => removeQuantity(id)} className={styles.actionButton} disabled={orderedQuantity <= 0}>-</button>
      </td>
    </tr>
  );
}


const Checkout = () => {
  const [product, setProduct] = useState()
  const [orderedQuantity, setOrderQuantity] = useState(0)
  useEffect(() => {
    const getProduct = async () => {
      const productData = await fetchProduct()
      setProduct(productData)
    }
    getProduct()
  }, [])

  const addQuantity = (id) => {
    setProduct(product.map((eachProduct) => {
      console.log(eachProduct)
      return eachProduct.id === id ? { ...eachProduct, orderedQuantity: eachProduct.orderedQuantity + 1 } : eachProduct
    }
    ))
  }

  const removeQuantity = (id) => {
    setProduct(product.map((eachProduct) => {
      console.log(eachProduct)
      return eachProduct.id === id ? { ...eachProduct, orderedQuantity: eachProduct.orderedQuantity - 1 } : eachProduct
    }
    ))
  }
  const fetchProduct = async () => {
    try {
      const response = await getProducts()
      return response.map((res) => { return { ...res, orderedQuantity: 0 } })
    } catch (error) {
      console.log(error)
    }

  }

  const TotalOrderSummary = () => {
    try {
      const totalSummary = product.reduce((acc, curr) => {
        return acc + (curr.orderedQuantity * curr.price)
      }, 0)
      return totalSummary.toFixed(2)
    } catch (error) {
      console.log(error)
    }
  }

  const DiscountCalculate = () => {
    try {
      const discount = TotalOrderSummary() >= 1000 ? TotalOrderSummary() - TotalOrderSummary() * 0.1 : 0
      return discount.toFixed(2)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(product)
  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {!product && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {product?.map((item) => (
              <Product removeQuantity={removeQuantity} addQuantity={addQuantity} key={item.id} id={item.id} name={item.name} availableCount={item.availableCount} price={item.price} orderedQuantity={item.orderedQuantity} total={(item.orderedQuantity * item.price).toFixed(2)} />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ {DiscountCalculate()}</p>
        <p>Total: $ {TotalOrderSummary()}</p>
      </main>
    </div>
  );
};

export default Checkout;