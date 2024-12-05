import { Product } from './MOBXProductsStore';
import { makeAutoObservable } from "mobx";
import axios from "axios";

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  images: string[];
  description: string;
}

class ProductStore {
  products: Product[] = [];
  isLoading: boolean = false;
  totalProducts: number = 0;
  limit: number = 4;
  skip: number = 0;
  searchQuery: string = "";
  selectedCategory: string | null = "";
  cart: {product: Product, quantity: number}[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProducts() {
    this.isLoading = true;
    try {
      const response = await axios.get(
        `https://dummyjson.com/products?limit=${this.limit}&skip=${this.skip}&select=title,price,description,category,images`
      );
      this.products = response.data.products;
      this.totalProducts = response.data.total;
    } catch (error) {
      console.error("Error fetch:", error);
    } finally {
      this.isLoading = false;
    }
  }

  setPage(page: number) {
    this.skip = (page - 1) * this.limit;
    this.fetchProducts();
  }

  addToCart = (product: Product) => {
    const item = this.cart.find((cartItem) => cartItem.product.id === product.id);
    console.log(this.cart);
    if(item) {
      item.quantity += 1;
    }else {
      this.cart.push({product, quantity: 1});
    }
  };

  updateQuantity = (productId: number, quantity: number) => {
    const item = this.cart.find((cartItem) => cartItem.product.id === productId);
    if(item) {
      item.quantity = qunatity;
    };
  };

  get totalPrice () {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity,0);
  };

  changeQuantity = (id: number, newQuantity: number) => {
    const item = this.cart.find((cartItem) => cartItem.product.id === id);
    if(item) {
      item.quantity = newQuantity;
    }
  };

  removeFromCart = (id: number) => {
    this.cart = this.cart.filter((cartItem) => cartItem.product.id !== id)
  };


}

const productStore = new ProductStore();
export default productStore;