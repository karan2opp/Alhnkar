// src/admin/CategoryPage.jsx
import { useState, useEffect, useRef } from "react";
import { useAdminCategoryStore } from "../store/useAdminCatrgoyrStore.js";
import { Icon } from "./SharedComponent.jsx";
import { showToast } from "../utils/showToast.jsx";
// src/admin/CategoryPage.jsx
import { SIZES } from "../../../backend/src/common/config/sizes.js"

export default function CategoryPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminCategoryStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sizeType: "",
    isActive: true,
    image: null,
    imagePreview: null,
  });

  const fileInputRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Show error toast if exists
  useEffect(() => {
    if (error) {
      showToast.error(error, "Category Error", 4000);
    }
  }, [error]);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Open modal for creating
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      sizeType: "",
      isActive: true,
      image: null,
      imagePreview: null,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      sizeType: category.sizeType || "",
      isActive: category.isActive ?? true,
      image: null,
      imagePreview: category.image?.url || null,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      sizeType: "",
      isActive: true,
      image: null,
      imagePreview: null,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast.error("Category name is required", "", 3000);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        sizeType: formData.sizeType.trim(),
        isActive: formData.isActive,
        image: formData.image,
      };

      if (editingCategory) {
        await updateCategory(editingCategory._id, payload);
        showToast.success("Category updated successfully", "", 2500);
      } else {
        await createCategory(payload);
        showToast.success("Category created successfully", "", 2500);
      }

      handleCloseModal();
    } catch (err) {
      // Error already handled in store
      console.error("Category submit error:", err);
    }
  };

  // Handle delete
  const handleDelete = async (categoryId, categoryName) => {
    if (
      !window.confirm(
        `Delete category "${categoryName}"? This will soft-delete it (set inactive).`
      )
    ) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      showToast.success("Category deleted successfully", "", 2500);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-[var(--color-text)]">
          Manage Categories
        </h2>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-bg text-sm font-medium rounded-lg hover:opacity-90 transition"
        >
          <Icon name="plus" size={16} color="var(--color-bg)" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-lg px-4 py-2.5 max-w-md">
          <Icon name="search" size={16} color="var(--color-muted)" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none bg-transparent text-[13px] text-[var(--color-text)] w-full placeholder-[var(--color-muted)]"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border-theme)]">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Image
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Name
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Size Type
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Status
              </th>
              <th className="px-5 py-3.5 text-right text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-[var(--color-muted)] text-[13px]">
                  Loading categories...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-[var(--color-muted)] text-[13px]">
                  {search ? "No categories found" : "No categories yet. Click 'Add Category' to create one."}
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b border-[var(--color-border-theme)] hover:bg-[var(--color-stripe)] transition"
                >
                  {/* Image */}
                  <td className="px-5 py-4">
                    {category.image?.url ? (
                      <img
                        src={category.image.url}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%237a6a5a' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Cpath d='M3 9h18'/%3E%3Cpath d='M9 21V9'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[var(--color-pri-light)] rounded-lg flex items-center justify-center">
                        <Icon name="box" size={20} color="var(--color-muted)" />
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-medium text-[var(--color-text)]">
                      {category.name}
                    </span>
                  </td>

                  {/* Size Type */}
                  <td className="px-5 py-4">
                    <span className="text-[12px] text-[var(--color-muted)]">
                      {category.sizeType || "-"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        category.isActive
                          ? "bg-[#e8f5e9] text-[#1b5e20]"
                          : "bg-[#fdecea] text-[#7f1d1d]"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(category)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--color-border-theme)] bg-transparent text-[var(--color-text)] text-[11px] font-medium rounded hover:bg-[var(--color-bg)] transition"
                    >
                      <Icon name="edit" size={12} color="var(--color-muted)" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--color-border-theme)] bg-[#fff5f5] text-[var(--color-accent)] text-[11px] font-medium rounded hover:bg-[#ffe0e0] transition"
                    >
                      <Icon name="trash" size={12} color="var(--color-accent)" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Create/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-theme)] rounded-xl w-full max-w-md p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-serif text-[var(--color-text)]">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-medium text-[var(--color-text)] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Sarees, Kurtis, etc."
                  className="w-full px-3 py-2.5 border border-[var(--color-border-theme)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] text-[13px] outline-none focus:border-[var(--color-primary)] transition"
                  required
                />
              </div>

              {/* Size Type */}
             {/* Size Type */}
<div>
  <label className="block text-[12px] font-medium text-[var(--color-text)] mb-1.5">
    Size Type
  </label>
  <select
    name="sizeType"
    value={formData.sizeType}
    onChange={handleChange}
    className="w-full px-3 py-2.5 border border-[var(--color-border-theme)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] text-[13px] outline-none focus:border-[var(--color-primary)] transition"
  >
    <option value="">Select size type</option>
    
    {/* ✅ Dynamic options from your SIZES constant */}
    {Object.entries(SIZES).map(([key, sizes]) => (
      <option key={key} value={key}>
        {key.charAt(0).toUpperCase() + key.slice(1)} ({sizes.join(", ")})
      </option>
    ))}
  </select>
</div>

              {/* Image Upload */}
              <div>
                <label className="block text-[12px] font-medium text-[var(--color-text)] mb-1.5">
                  Category Image
                </label>
                <div className="flex items-center gap-4">
                  {formData.imagePreview && (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-[var(--color-border-theme)]"
                    />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 text-[12px] text-[var(--color-muted)] file:mr-3 file:px-3 file:py-1.5 file:border file:border-[var(--color-border-theme)] file:rounded file:bg-[var(--color-bg)] file:text-[var(--color-text)] file:text-[11px] file:font-medium file:cursor-pointer hover:file:bg-[var(--color-stripe)] transition"
                  />
                </div>
                <p className="text-[10px] text-[var(--color-muted)] mt-1">
                  Recommended: 400x400px, JPG/PNG
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[var(--color-border-theme)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="isActive" className="text-[12px] text-[var(--color-text)]">
                  Active (visible to customers)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[var(--color-primary)] text-bg py-2.5 text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border border-[var(--color-border-theme)] bg-transparent text-[var(--color-text)] py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--color-bg)] transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}