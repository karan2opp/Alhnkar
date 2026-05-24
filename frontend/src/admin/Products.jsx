import { useEffect, useState } from "react";
import { useAdminProductStore } from "../store/useAdminProductStore.js";
import { Icon, StatusBadge } from "./SharedComponent";

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

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [formImages, setFormImages] = useState([]);

  // Load products on mount
  useEffect(() => {
    fetchProducts({});
  }, []);

  // ── Helper: Get product ID (handles _id or id) ───────────────────────
  const getProductId = (product) => product?._id || product?.id;

  // ── Helper: Extract category ID (handles object or string) ───────────
  const getCategoryValue = (category) => {
    if (!category) return "";
    if (typeof category === "object") return category._id || category.id || "";
    return category;
  };

  // ── Helper: Extract category name for display ────────────────────────
  const getCategoryName = (category) => {
    if (!category) return "-";
    if (typeof category === "object") return category.name || category.title || getCategoryValue(category);
    return category;
  };

  // Filter locally (handle category as object or string)
  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(p.category).toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form) => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        category: getCategoryValue(form.category),
        images: formImages,
      };

      if (modal === "add") {
        await createProduct(payload);
      } else {
        const productId = getProductId(modal); // ← FIX: Use _id or id
        if (!productId) throw new Error("Product ID is missing");
        await updateProduct(productId, payload);
      }
      setModal(null);
      setFormImages([]);
      fetchProducts({}); // refresh list
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModal(product);
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
          onClose={() => {
            setModal(null);
            setFormImages([]);
          }}
          onSave={handleSave}
          images={formImages}
          onImagesChange={setFormImages}
          getCategoryValue={getCategoryValue}
          getCategoryName={getCategoryName}
          getProductId={getProductId}
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
          onClick={() => setModal("add")}
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
              {["Product", "Category", "Gender", "Price", "Stock", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide border-b border-[var(--color-border-theme)]"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const productId = getProductId(p);
              const stock = p.stock ?? p.variants?.[0]?.stock ?? 0;
              
              return (
                <tr
                  key={productId}
                  className={i % 2 === 0 ? "bg-[var(--color-surface)]" : "bg-[var(--color-stripe)]"}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[var(--color-pri-light)] rounded-md flex items-center justify-center flex-shrink-0">
                        <Icon name="pkg" size={14} color="var(--color-accent)" />
                      </div>
                      <span className="text-[13px] font-medium text-[var(--color-text)]">
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">
                    {getCategoryName(p.category)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-muted)]">
                    {p.gender}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[var(--color-text)]">
                    ₹{p.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[12px] font-medium ${
                        stock === 0
                          ? "text-[#7f1d1d]"
                          : stock < 10
                          ? "text-[#7a4f00]"
                          : "text-[#1b5e20]"
                      }`}
                    >
                      {stock === 0 ? "Out of stock" : stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        p.isActive !== false
                          ? "bg-[#e8f5e9] text-[#1b5e20]"
                          : "bg-[#fdecea] text-[#7f1d1d]"
                      }`}
                    >
                      {p.isActive !== false ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-2.5 py-1.5 rounded-md text-[11px] border border-[var(--color-border-theme)] bg-transparent text-[var(--color-text)] cursor-pointer flex items-center gap-1 hover:bg-[var(--color-bg)] transition"
                      >
                        <Icon name="edit" size={12} color="var(--color-muted)" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(productId)}
                        className="px-2.5 py-1.5 rounded-md text-[11px] border border-[#fca5a5] bg-[#fef2f2] text-[#7f1d1d] cursor-pointer flex items-center gap-1 hover:bg-[#fecaca] transition"
                        disabled={loading}
                      >
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
          <div className="text-center py-10 text-[var(--color-muted)] text-[13px]">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}

// ── ProductModal with proper ID and category handling ──────────────────
const ProductModal = ({ product, onClose, onSave, images, onImagesChange, getCategoryValue, getCategoryName, getProductId }) => {
  // Extract initial values safely
  const initialProductId = product ? getProductId(product) : null;
  const initialCategoryId = product ? getCategoryValue(product.category) : "";
  const initialVariant = product?.variants?.[0] || { size: "Free Size", stock: product?.stock ?? 0 };

  const [form, setForm] = useState(
    product
      ? {
          _id: initialProductId,
          title: product.title || "",
          description: product.description || "",
          category: initialCategoryId,
          price: product.price?.toString() || "",
          gender: product.gender || "men",
          isActive: product.isActive !== false,
          variants: [initialVariant],
        }
      : {
          title: "",
          description: "",
          category: "",
          price: "",
          gender: "men",
          isActive: true,
          variants: [{ size: "Free Size", stock: 0 }],
        }
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[var(--color-surface)] rounded-2xl p-7 w-[520px] border border-[var(--color-border-theme)] my-8">
        <div className="text-[16px] font-medium text-[var(--color-text)] mb-5">
          {product ? "Update product" : "Add new product"}
        </div>

        {/* Basic Fields */}
        {[
          { label: "Title", key: "title", type: "text" },
          { label: "Description", key: "description", type: "text", textarea: true },
          { label: "Price (₹)", key: "price", type: "number" },
          { label: "Category ID", key: "category", type: "text", placeholder: "MongoDB ObjectId" },
        ].map((f) => (
          <div key={f.key} className="mb-3.5">
            <label className="text-[12px] text-[var(--color-muted)] block mb-1">
              {f.label}
            </label>
            {f.textarea ? (
              <textarea
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:ring-1 focus:ring-[var(--color-accent)] min-h-[80px]"
              />
            ) : (
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            )}
          </div>
        ))}

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
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.value === "true" })
              }
              className="w-full px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Variants (simplified: single variant for now) */}
        <div className="mb-4">
          <label className="text-[12px] text-[var(--color-muted)] block mb-2">
            Variant (Size + Stock)
          </label>
          <div className="flex gap-2">
            <select
              value={form.variants?.[0]?.size || "Free Size"}
              onChange={(e) =>
                setForm({
                  ...form,
                  variants: [{ size: e.target.value, stock: form.variants?.[0]?.stock ?? 0 }],
                })
              }
              className="flex-1 px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none"
            >
              {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Stock"
              value={form.variants?.[0]?.stock ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  variants: [{ size: form.variants?.[0]?.size || "Free Size", stock: Number(e.target.value) }],
                })
              }
              className="w-24 px-3 py-2 rounded-lg text-[13px] border border-[var(--color-border-theme)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none"
            />
          </div>
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