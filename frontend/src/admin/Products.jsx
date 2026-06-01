// src/admin/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useAdminProductStore } from "../store/useAdminProductStore.js";
import { useAdminCategoryStore } from "../store/useAdminCatrgoyrStore.js";
import { Icon, StatusBadge } from "./SharedComponent.jsx";
import { showToast } from "../utils/showToast.jsx";
import { SIZES } from "../../../backend/src/common/config/sizes.js"; // ✅ Import your SIZES constant

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setSelectedProduct,
  } = useAdminProductStore();

  const { categories, fetchCategories: fetchAdminCategories, loading: categoriesLoading } = useAdminCategoryStore();
  const [categoriesFetched, setCategoriesFetched] = useState(false);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [formImages, setFormImages] = useState([]);

  useEffect(() => {
   fetchProducts({})
     
  }, [fetchProducts]);

  useEffect(() => {
    if (modal && !categoriesFetched) {
      fetchAdminCategories().then(() => setCategoriesFetched(true));
    }
  }, [modal, categoriesFetched, fetchAdminCategories]);

  const getProductId = (product) => product?._id || product?.id;

  const getCategoryValue = (category) => {
    if (!category) return "";
    if (typeof category === "object") return category._id || category.id || "";
    return category;
  };

  const getCategoryName = (category) => {
    if (!category) return "-";
    if (typeof category === "object") return category.name || category.title || getCategoryValue(category);
    return category;
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(p.category).toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    try {
      const categoryId = typeof form.category === "object" 
        ? form.category._id || form.category.id 
        : form.category;

      const payload = {
        ...form,
        price: Number(form.price),
        category: categoryId,
        images: formImages,
        // ✅ Ensure variants is an array of { size, stock }
        variants: Array.isArray(form.variants) 
          ? form.variants.filter(v => v.size && v.stock !== undefined) 
          : [],
      };

      if (modal === "add") {
        await createProduct(payload);
        showToast.success("Product created successfully", "", 2500);
      } else {
        const productId = getProductId(modal);
        if (!productId) throw new Error("Product ID is missing");
        await updateProduct(productId, payload);
        showToast.success("Product updated successfully", "", 2500);
      }
      setModal(null);
      setFormImages([]);
      fetchProducts({});
    } catch (err) {
      console.error("Save failed:", err);
      showToast.error(err.message || "Failed to save product", "", 4000);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(id);
        showToast.success("Product deleted successfully", "", 2500);
      } catch (err) {
        console.error("Delete failed:", err);
        showToast.error(err.message || "Failed to delete product", "", 4000);
      }
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModal(product);
    setFormImages([]);
  };

  const openAddModal = () => {
    setModal("add");
    setFormImages([]);
  };

  if (loading && products.length === 0) {
    return <div className="p-6 text-[var(--color-muted)]">Loading products...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[#fef2f2] text-[#7f1d1d] text-[13px]">
          {error}
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => { setModal(null); setFormImages([]); }}
          onSave={handleSave}
          images={formImages}
          onImagesChange={setFormImages}
          getCategoryValue={getCategoryValue}
          getCategoryName={getCategoryName}
          getProductId={getProductId}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />
      )}

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-4.5">
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-lg px-3 py-2 w-70">
          <Icon name="search" size={14} color="var(--color-muted)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="border-none outline-none bg-transparent text-[13px] text-[var(--color-text)] w-full placeholder-[var(--color-muted)]"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4.5 py-2.25 rounded-lg text-[13px] border-none bg-[var(--color-gold)] text-white cursor-pointer font-medium hover:opacity-90 transition"
        >
          <Icon name="plus" size={14} color="#fff" /> Add product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-[var(--color-bg)]">
              {["Product", "Category", "Gender", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide border-b border-[var(--color-border-theme)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const productId = getProductId(p);
              const stock = p.stock ?? p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
              
              return (
                <tr key={productId} className={i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-stripe)]"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[var(--color-pri-light)] rounded-md flex items-center justify-center flex-shrink-0">
                        <Icon name="pkg" size={14} color="var(--color-accent)" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--color-text)]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">{getCategoryName(p.category)}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">{p.gender}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[var(--color-text)]">₹{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-medium ${stock === 0 ? "text-[#7f1d1d]" : stock < 10 ? "text-[#7a4f00]" : "text-[#1b5e20]"}`}>
                      {stock === 0 ? "Out of stock" : stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${p.isActive !== false ? "bg-[#e8f5e9] text-[#1b5e20]" : "bg-[#fdecea] text-[#7f1d1d]"}`}>
                      {p.isActive !== false ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditModal(p)} className="px-2.5 py-1.5 rounded-md text-[11px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-text)] cursor-pointer flex items-center gap-1 hover:bg-[var(--color-bg)] transition">
                        <Icon name="edit" size={12} color="var(--color-muted)" /> Edit
                      </button>
                      <button onClick={() => handleDelete(productId)} className="px-2.5 py-1.5 rounded-md text-[11px] border border-[#fca5a5] bg-[#fef2f2] text-[#7f1d1d] cursor-pointer flex items-center gap-1 hover:bg-[#fecaca] transition" disabled={loading}>
                        <Icon name="trash" size={12} color="#7f1d1d" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-[var(--color-muted)] text-[13px]">No products found</div>
        )}
      </div>
    </div>
  );
}

// ── ProductModal with Multi-Variant Support ──────────────────────────────────
const ProductModal = ({ 
  product, 
  onClose, 
  onSave, 
  images, 
  onImagesChange, 
  getCategoryValue, 
  getCategoryName, 
  getProductId,
  categories = [],
  categoriesLoading = false,
}) => {
  const initialCategoryId = product 
    ? (typeof product.category === "object" ? product.category._id || product.category.id : product.category)
    : "";
console.log("this are products",product);

  // ✅ Pre-populate variants from product or default to empty array
  const initialVariants = product?.variants?.length 
    ? product.variants.map(v => ({ size: v.size || "Free Size", stock: v.stock ?? 0 }))
    : [{ size: "Free Size", stock: 0 }];

  const [form, setForm] = useState(
    product
      ? {
          _id: getProductId(product),
          title: product.title || "",
          description: product.description || "",
          category: initialCategoryId,
          price: product.price?.toString() || "",
          gender: product.gender || "men",
          isActive: product.isActive !== false,
          variants: initialVariants,
        }
      : {
          title: "",
          description: "",
          category: "",
          price: "",
          gender: "men",
          isActive: true,
          variants: [{ size: "", stock: 0 }],
        }
  );
  useEffect(() => {
  if (!product && form.category) {
    // Only for new products, reset to match category's sizeType
    const sizeType = categories.find(c => c._id === form.category)?.sizeType;
    const availableSizes = SIZES[sizeType] || SIZES.freesize;
    
    setForm(prev => ({
      ...prev,
      variants: [{ size: availableSizes[0], stock: 0 }]
    }));
  } 
  
}, [form.category, categories, product]);

  // ✅ Add a new variant row
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "Free Size", stock: 0 }],
    }));
  };

  // ✅ Update a specific variant
  const updateVariant = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  // ✅ Remove a variant row
  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // ✅ Get available sizes based on selected category
  const getAvailableSizes = () => {
    const sizeType = categories.find(c => c._id === form.category)?.sizeType;
    console.log(sizeType);
    
    return SIZES[sizeType] || SIZES.freesize;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[var(--color-surface)] rounded-2xl p-7 w-[520px] border border-[var(--color-border-theme)] my-8 max-h-[90vh] overflow-y-auto">
        <div className="text-[16px] font-medium text-[var(--color-text)] mb-5">
          {product ? "Update product" : "Add new product"}
        </div>

        {/* Title */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[var(--color-muted)] block mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[var(--color-muted)] block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:ring-1 focus:ring-[var(--color-accent)] min-h-[80px]"
          />
        </div>

        {/* Price */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[var(--color-muted)] block mb-1">Price (₹) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[var(--color-muted)] block mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            required
            disabled={categoriesLoading}
          >
            <option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name} {cat.sizeType && `• ${cat.sizeType}`}
              </option>
            ))}
          </select>
        </div>

        {/* Gender + Active */}
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className="text-[12px] text-[var(--color-muted)] block mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none"
            >
              {["men", "women", "kids", "unisex"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px] text-[var(--color-muted)] block mb-1">Status</label>
            <select
              value={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
              className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* ✅ Variants Section - Multiple Sizes + Stock */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[12px] font-medium text-[var(--color-text)]">
              Variants (Size + Stock)
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="text-[11px] text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              <Icon name="plus" size={12} color="var(--color-primary)" />
              Add Variant
            </button>
          </div>

          <div className="space-y-2">
            {form.variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-[var(--color-border-theme)] rounded-lg bg-[var(--color-bg)]">
                {/* Size Select - Dynamic based on category */}
                <select
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded text-[12px] border border-[var(--color-border-theme)] bg-[var(--color-surface)] text-[var(--color-text)] outline-none"
                >
                  {getAvailableSizes().map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>

                {/* Stock Input */}
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 rounded text-[12px] border border-[var(--color-border-theme)] bg-[var(--color-surface)] text-[var(--color-text)] outline-none"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={form.variants.length === 1}
                  className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition disabled:opacity-30"
                  title="Remove variant"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-[var(--color-muted)] mt-2">
            Add variants for different sizes. Stock is tracked per size.
          </p>
        </div>

        {/* Image Upload */}
        <div className="mb-5">
          <label className="text-[12px] text-[var(--color-muted)] block mb-1">
            Product Images (max 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onImagesChange?.(e.target.files)}
            className="w-full text-[12px] text-[var(--color-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:font-medium file:bg-[var(--color-gold-light)] file:text-[#7a4f00] hover:file:opacity-90"
          />
          {images?.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {Array.from(images).map((file, idx) => (
                <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border-theme)]">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(file)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 justify-end pt-2 border-t border-[var(--color-border-theme)]">
          <button
            onClick={onClose}
            className="px-5 py-2.25 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-muted)] cursor-pointer hover:opacity-80 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2.25 rounded-lg text-[13px] border-none bg-[var(--color-accent)] text-white cursor-pointer hover:bg-[var(--color-accent-dark)] transition"
          >
            {product ? "Update" : "Add product"}
          </button>
        </div>
      </div>
    </div>
  );
};