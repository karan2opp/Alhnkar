import React from 'react'
import Navbar from '../components/Navbar'
import ProductDetailCard from './ProductDetailCard'
import { useParams } from 'react-router-dom'

const ProductDetailPage = () => {
    const { id } = useParams();
  return (
    <div>
      <Navbar />
      <ProductDetailCard id={id}/>
    </div>
  )
}

export default ProductDetailPage
