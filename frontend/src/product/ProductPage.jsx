import React from 'react'
import ProductCard from './ProductCard'
import { useProductStore } from '../store/useProductStore'

import { useEffect } from "react";


const ProductPage = () => {
  const {
    selectedProduct,
    fetchProductById,
    loading,
  } = useProductStore();

  useEffect(() => {
    fetchProductById("69dfc866d022ffc93f4c336e");
  }, []);
  console.log(selectedProduct);
  

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ProductCard product={selectedProduct} />
    </div>
  );
};

export default ProductPage;
