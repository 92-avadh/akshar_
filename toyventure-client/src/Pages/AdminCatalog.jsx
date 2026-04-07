import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../features/api/apiSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, '');

const AdminCatalog = () => {

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [uploading, setUploading] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState({
    title: '', price: 0, oldPrice: 0, description: '', img: '', images: [], tag: '', countInStock: 0
  });

  // --- API HOOKS ---
  const { data: productsData, isLoading } = useGetProductsQuery({ keyword: searchTerm, limit: 100 });
  const products = productsData?.products || [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // --- HANDLERS ---
  const handleCreateProduct = async () => {
    if (window.confirm('Create a new blank product template?')) {
      try {
        const newProduct = await createProduct().unwrap();
        setEditingProduct({ ...newProduct, images: newProduct.images || [] });
        setIsFormOpen(true); 
        window.scrollTo(0, 0); 
      } catch (err) {
        alert('Failed to create product template');
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this toy?')) {
      try {
        await deleteProduct(id).unwrap();
        alert('Toy deleted successfully');
      } catch (err) {
        alert('Failed to delete toy');
      }
    }
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct).unwrap();
      alert('Product updated successfully!');
      setIsFormOpen(false); 
      window.scrollTo(0, 0);
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleEditChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  // MULTIPLE FILE UPLOAD LOGIC
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    
    if (files.length > 7) {
      alert('You can only upload a maximum of 7 images.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json(); 

      setEditingProduct({
        ...editingProduct,
        images: data,
        img: data[0] 
      });
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert('Image upload failed. Ensure server is running and files are images.');
      setUploading(false);
    }
  };

  const resolveImage = (imgSrc) => {
    if (!imgSrc) return '';
    return imgSrc.startsWith('/uploads') ? `${ASSET_BASE_URL}${imgSrc}` : imgSrc;
  };

  if (isLoading) return <div className="pt-32 text-center font-bold text-zinc-500">Loading Catalog...</div>;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {isFormOpen ? (
          // =========================================================
          // FULL PAGE FORM VIEW 
          // =========================================================
          <div className="animate-[fadeIn_0.3s_ease-out]">
            
            <div className="mb-8">
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-primary-container mb-4 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Catalog
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-sm">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-zinc-800 tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-[36px]">edit_square</span> 
                    {editingProduct.title === 'New Magical Toy' ? 'Draft New Toy' : 'Edit Toy Details'}
                  </h1>
                  <p className="text-zinc-500 font-bold mt-2">Update pricing, inventory, and product details below.</p>
                </div>
              </div>
            </div>

            <div className="card-surface p-8 md:p-12 rounded-[3rem] border border-white shadow-soft">
              <form onSubmit={handleUpdateProductSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  
                  {/* Column 1 & 2: Main Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">Product Title</label>
                      <input type="text" name="title" value={editingProduct.title} onChange={handleEditChange} required className="w-full bg-zinc-50 p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 font-bold text-zinc-800 text-lg transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">Current Price (₹)</label>
                        <input type="number" name="price" value={editingProduct.price} onChange={handleEditChange} required className="w-full bg-zinc-50 p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 font-black text-primary-container text-xl transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">MRP / Old Price (₹)</label>
                        <input type="number" name="oldPrice" value={editingProduct.oldPrice} onChange={handleEditChange} className="w-full bg-zinc-50 p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 font-bold text-zinc-500 line-through text-xl transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea name="description" rows="6" value={editingProduct.description} onChange={handleEditChange} className="w-full bg-zinc-50 p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 resize-none font-medium text-zinc-600 text-lg transition-all"></textarea>
                    </div>
                  </div>

                  {/* Column 3: Inventory & Media */}
                  <div className="space-y-6 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">Stock Count</label>
                      <input type="number" name="countInStock" value={editingProduct.countInStock} onChange={handleEditChange} required className="w-full bg-white p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 font-black text-zinc-800 text-xl transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">Category Tag</label>
                      <input type="text" name="tag" value={editingProduct.tag} onChange={handleEditChange} placeholder="e.g. Educational" className="w-full bg-white p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 font-bold text-zinc-800 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-zinc-400 uppercase tracking-widest ml-1">Upload Product Images (Max 7)</label>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileUpload} 
                        disabled={uploading}
                        className="w-full bg-white p-4 rounded-2xl focus:ring-4 focus:ring-primary-container/20 outline-none border border-zinc-200 text-sm font-medium transition-all file:bg-primary-container/10 file:text-primary-container file:border-0 file:rounded-xl file:px-4 file:py-2 file:font-bold hover:file:bg-primary-container/20 cursor-pointer disabled:opacity-50" 
                      />
                      
                      {uploading && <p className="text-xs font-bold text-primary-container mt-2 animate-pulse">Uploading images...</p>}

                      {editingProduct.images && editingProduct.images.length > 0 ? (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {editingProduct.images.map((img, idx) => (
                            <div key={idx} className="rounded-xl border border-zinc-200 overflow-hidden bg-white p-1 shadow-sm aspect-square relative">
                              {idx === 0 && <span className="absolute top-1 left-1 bg-primary-container text-white text-[10px] px-2 py-0.5 rounded-md font-bold z-10 shadow-sm">Main</span>}
                              <img src={resolveImage(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                            </div>
                          ))}
                        </div>
                      ) : editingProduct.img && (
                        <div className="mt-4 rounded-3xl border border-zinc-200 overflow-hidden bg-white p-2 shadow-sm">
                          <img src={resolveImage(editingProduct.img)} alt="Preview" className="w-full aspect-square object-contain mix-blend-multiply" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100 flex gap-4">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-8 py-4 bg-zinc-100 text-zinc-600 font-black text-lg rounded-2xl hover:bg-zinc-200 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUpdating || uploading} className="flex-1 py-4 bg-zinc-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-1 disabled:opacity-50">
                    {isUpdating ? 'Saving to Database...' : 'Save Product Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        ) : (
          
          // =========================================================
          // CATALOG TABLE VIEW
          // =========================================================
          <div className="animate-[fadeIn_0.3s_ease-out]">
            
            <div className="mb-8">
              <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-primary-container mb-4 transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Dashboard
              </Link>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-sm">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-zinc-800 tracking-tight">Inventory Catalog</h1>
                  <p className="text-zinc-500 font-bold mt-2">Manage your toys, update pricing, and track stock levels.</p>
                </div>
                <button 
                  onClick={handleCreateProduct}
                  disabled={isCreating}
                  className="bg-primary-container text-white px-8 py-4 rounded-2xl font-black shadow-md hover:bg-orange-600 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 w-full md:w-auto"
                >
                  <span className="material-symbols-outlined">add_circle</span> Add New Toy
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
                <input 
                  type="text" 
                  placeholder="Search catalog by name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/80 border border-white shadow-sm pl-12 pr-4 py-3 rounded-full font-medium focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
                />
              </div>
              <div className="flex gap-4 text-sm font-bold text-zinc-500">
                <span className="bg-white/60 px-4 py-2 rounded-full border border-white shadow-sm">Total Toys: {products.length}</span>
                <span className="bg-red-50 text-red-600 px-4 py-2 rounded-full border border-red-100 shadow-sm">Low Stock: {products.filter(p => p.countInStock < 5).length}</span>
              </div>
            </div>

            <div className="card-surface rounded-[2.5rem] border border-white shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-100">
                      <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pl-8 w-24">Image</th>
                      <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Product Name</th>
                      <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Price</th>
                      <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Stock Status</th>
                      <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider">Category</th>
                      <th className="p-5 text-xs font-black text-zinc-400 uppercase tracking-wider pr-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product._id} className="hover:bg-white transition-colors border-b border-zinc-50 group">
                        <td className="p-5 pl-8">
                          <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 p-1">
                            <img src={resolveImage(product.img)} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-zinc-800 text-sm max-w-[250px] truncate" title={product.title}>{product.title}</p>
                          <p className="text-xs font-mono text-zinc-400 mt-1">ID: ...{product._id.substring(product._id.length - 6)}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-black text-zinc-800">₹{product.price}</p>
                          {product.oldPrice > 0 && <p className="text-xs text-zinc-400 line-through">₹{product.oldPrice}</p>}
                        </td>
                        <td className="p-5">
                          {product.countInStock > 10 ? (
                            <span className="bg-green-50 text-green-700 text-xs font-black px-3 py-1.5 rounded-full border border-green-200 shadow-sm flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">inventory</span> {product.countInStock} in stock
                            </span>
                          ) : product.countInStock > 0 ? (
                            <span className="bg-orange-50 text-orange-600 text-xs font-black px-3 py-1.5 rounded-full border border-orange-200 shadow-sm flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">warning</span> Low: {product.countInStock} left
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-600 text-xs font-black px-3 py-1.5 rounded-full border border-red-200 shadow-sm flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">error</span> Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="p-5">
                          <span className="bg-zinc-100 text-zinc-600 text-xs font-bold px-3 py-1 rounded-full">{product.tag || 'Uncategorized'}</span>
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { 
                                setEditingProduct({ ...product, images: product.images || [] }); 
                                setIsFormOpen(true); 
                                window.scrollTo(0, 0); 
                              }}
                              className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors shadow-sm border border-zinc-200"
                              title="Edit Details"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={isDeleting}
                              className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm border border-red-100 disabled:opacity-50"
                              title="Delete Toy"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products?.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-20">
                          <span className="material-symbols-outlined text-[48px] text-zinc-300 mb-2 block">search_off</span>
                          <p className="text-zinc-500 font-bold">No products found matching your search.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
};

export default AdminCatalog;
