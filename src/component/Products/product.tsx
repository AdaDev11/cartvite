import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import productStore from "./MOBXProductsStore";
import { Card, Image, Pagination, Loader, Text, Modal, Button, Stack, Divider, Group } from "@mantine/core";
import '@mantine/core/styles.css';
import { debounce } from 'lodash';

const OrderForm = observer(() => {
  interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    images: string[];
    description: string;
  }

  useEffect(() => {
    productStore.fetchProducts();
  }, []);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null> (null);
  const [cartOpened, setCartOpened] = useState(false);

  const handleOpenCart = () => setCartOpened(true);
  const handleCloseCart = () => setCartOpened(false);
  const [search, setSearch] = useState("");
  const [filterPriceProducts, setFilterPriceProducts] = useState<Product | null> ([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  // const [filterPrice. setFilterPrice] = useState(0);

  const debouncedSearch = debounce((query) => {
    productStore.searchProducts(query);
  }, 300);
  
//  handele Search whis search, useState work input search
  const handelSearch = (event) => {
    const query = event.target.value;
    setSearch(query);
    console.log(query);
    if(query.trim()) { 
      debouncedSearch(query);
    } else {
      productStore.fetchProducts();
    }
  };

  const handleCategory = async (category) => {
    await productStore.filterCategories(category);
  };


  const handlePriceFilter = async () => {
    if (minPrice.trim() && maxPrice.trim()) {
      await productStore.filteredPrice(minPrice, maxPrice);
    } else {
      console.log("Please provide valid price range");
    }
  };


  return (
    <>
    
    {selectedProduct && (
      <Modal opened={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct.title}>
        <Image src={selectedProduct.images[0]} alt={selectedProduct.title} height={200} fit="cover" />
        <Text>{selectedProduct.description}</Text>
        <Text>{selectedProduct.price}$</Text>
        <Button variant="light" color="blue" fullWidth mt="md" onClick = {() => productStore.addToCart(selectedProduct)}>Add to Cart</Button>
    </Modal>
    )}
    
    {cartOpened && (
    <Modal opened={cartOpened} onClose={handleCloseCart} title="Shopping Cart" size="lg">
      {productStore.cart.length === 0 ? (
        <Text>Cart is empty</Text>
      ) : (
        <Stack>
        {productStore.cart.map(({ product, quantity }) => (
          <Card key={product.id} shadow="sm" padding="lg" radius="md">
            <Group>
              <Image src={product.images[0]} alt={product.title} width={50} height={50} />
                <Stack style={{ flex: 1}}>
                  <Text>{product.title}</Text>
                <Group>
                  <Button onClick={() => productStore.changeQuantity(product.id, quantity - 1)}>-</Button>
                  <Text>{quantity}</Text>
                  <Button onClick={() => productStore.changeQuantity(product.id, quantity + 1)}>+</Button>
                </Group>
                <Text size="sm">{(product.price * quantity).toFixed(2)}$</Text>
                </Stack>
                <Button color="red" onClick={() => productStore.removeFromCart(product.id)}>Remove</Button>
            </Group>
          </Card>
        ))}
        <Divider />
        <Text style={{weight: '700px'}} size="xl">Total: {productStore.totalPrice.toFixed(2)}$</Text>
        <Button onClick = {() => alert("O")}>Order</Button>
        </Stack>
      )}
    </Modal>
    )}

      <h1>Products</h1>

      <Button onClick = {handleOpenCart}>View Cart</Button>
      <br/>
      <input 
      type = "text"
      placeholder = "Search products"
      value = {search}
      onChange = {handelSearch}
      />

      <span>Price</span>
      <select onChange = {(e) => handlePriceFilter(e)}>
          <option value="1-10">from 1$-10$</option>
          <option value="10-15">from 10$-15$</option>
          <option value="20-30">from 20$-30$</option>
          <option value="30-40">from 30$-40$</option>
          <option value="40-50">from 40$-50$</option>
          <option value="50-100">from 50$-100$</option>
          <option value="100-1000">from 100$-1000$</option>
          <option value="1000-infinity">Above 1000$</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <Button onClick={handlePriceFilter}>Filter</Button>
      


      <Button onClick={() => handleCategory("beauty")}>Beauty</Button>
      <Button onClick={() => handleCategory("fragrances")}>Fragrances</Button>
      <Button onClick={() => handleCategory("furniture")}>Furniture</Button>
      <Button onClick={() => handleCategory("groceries")}>Groceries</Button>
      <Button onClick={() => handleCategory("home-decoration")}>Home-decoration</Button>
      <Button onClick={() => handleCategory("kitchen-accessories")}>Kitchen-accessories</Button>
      <Button onClick={() => handleCategory("laptops")}>Laptops</Button>
      <Button onClick={() => handleCategory("mens-shirts")}>Mens-shirts</Button>
      <Button onClick={() => handleCategory("mens-shoes")}>Mens-shoes</Button>
      <Button onClick={() => handleCategory("mens-watches")}>Mens-watches</Button>
      <Button onClick={() => handleCategory("motorcycle")}>Motorcycle</Button>
      <Button onClick={() => handleCategory("skin-care")}>Skin-care</Button>
      <Button onClick={() => handleCategory("smartphones")}>Smartphones</Button>
      

      <hr/>
      {productStore.isLoading ? (
        <Loader size="lg" />
            ) : (
              <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                margin: "40px",
                padding: "40px",
              }} >
        {productStore.products.map((product) => (
          <Card key={product.id}>
            <Card.Section>
              <Image
                src={product.images && product.images[0] ? product.images[0] : ""}
                alt={product.title}
                height={160}
                fit="cover"
                
              />
            </Card.Section>
            <Text style = {{margin: '10px', padding: '10px'}}>
              {product.title}
            </Text>
            <Text>
              ${product.price}
            </Text>
            <Group>
              <Button fullWidth mt="md" onClick={() => setSelectedProduct(product)}>View</Button><br/>
              <Button fullWidth mt="md" onClick = {() => productStore.addToCart(product)}>Add to Cart</Button>
            </Group>

          </Card>
          
        ))}
      </div>
      )}

      <Pagination
      total={Math.ceil(productStore.totalProducts / productStore.limit)}
      onChange={(page) => productStore.setPage(page)}
      style = {{ margin: '40px', padding: '40px', alignItems: 'center'}}
      />

        
    </>
  );
});

export default OrderForm;