import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import productStore from "./MOBXProductsStore";
import { Card, Image, Pagination, Loader, Text, Modal, Button, Stack, Divider, Group } from "@mantine/core";
import '@mantine/core/styles.css';

const OrderForm = observer(() => {
  useEffect(() => {
    productStore.fetchProducts();
  }, []);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null> (null);
  const [cartOpened, setCartOpened] = useState(false);

  const handleOpenCart = () => setCartOpened(true);
  const handleCloseCart = () => setCartOpened(false);

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
