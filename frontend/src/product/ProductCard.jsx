import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function ProductCard({ product }) {
    const navigate=useNavigate()
  return (
    <div className="group">
      <div className="relative rounded-xl overflow-hidden bg-surface border border-primary/10">
        <img
          src={product.images[0].url}
          alt={product.title}
          className="w-full h-[320px] object-cover group-hover:scale-105 transition duration-500"
        />


      </div>

      <div className="pt-4">
        <h3 className="text-lg font-medium text-text mb-2">
          {product.title}
        </h3>

        <p className="text-primary font-semibold mb-4">
          ₹ {product.price}
        </p>

        <button onClick={()=>{
           
            navigate(`/productDetail/${product._id}`
        )
    }} className="w-full border border-primary/20 py-3 text-sm tracking-wide hover:bg-primary hover:text-bg transition flex items-center justify-center gap-2">
          <ShoppingBag size={16} />
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
}