

  async filteredPrice (minPrice, maxPrice) {
    this.isLoading = true;
    try {
      const res = await axios.get(`https://dummyjson.com/products?minPrice=${minPrice}&maxPrice=${maxPrice}`)
      this.products = res.data.products;
      console.log(res + "jhknm " + this.products);
    } catch {
      console.error("Price filter error: " + error);
    }
  }
