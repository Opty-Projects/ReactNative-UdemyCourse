import CartProduct from './CartProduct';

export default interface Order {
  id: string
  timestamp: number
  cartProducts: Record<string, CartProduct>
  price: number
}
