// src/product/ProductDetailPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import ProductDetailCard from './ProductDetailCard';
import Reviews from '../review/Reviews.jsx';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <Navbar />
      <div className="bg-bg min-h-screen px-4 md:px-10 py-10">
        <ProductDetailCard id={id} />
        <Reviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;