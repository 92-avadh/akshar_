import React, { useState, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [isCreatingNew, setIsCreatingNew] = useState(false); 
  const [uploading, setUploading] = useState(false);
  
  // NEW: Added isPopular to state
  const [editingProduct, setEditingProduct] = useState({
    title: '', price: '', oldPrice: '', description: '', img: '', images: [], tag: '', category: '', countInStock: '', isPopular: false,
    variants: [] 
  });

  const { data: productsData, isLoading } = useGetProductsQuery({ keyword: searchTerm, limit: 100, isAdmin: 'true' });
  const products = productsData?.products || [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormOpen && isCreatingNew) {
        const message = "You have unsaved changes.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormOpen, isCreatingNew]);

  const handleCreateProduct = async () => {
    if (window.confirm('Create a new blank product template?')) {
      try {
        const newProduct = await createProduct().unwrap();
        setEditingProduct({ 
          ...newProduct, 
          title: '', price: '', oldPrice: '', description: '', countInStock: '', isPopular: false,
          images: newProduct.images || [],
          variants: [] 
        });
        setIsCreatingNew(true); 
        setIsFormOpen(true); 
        window.scrollTo(0, 0); 
      } catch (err) { alert('Failed to create product template'); }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this toy?')) {
      try {
        await deleteProduct(id).unwrap();
        alert('Toy deleted successfully');
      } catch (err) { alert('Failed to delete toy'); }
    }
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedProduct = {
        ...editingProduct,
        price: editingProduct.price === '' ? 0 : Number(editingProduct.price),
        oldPrice: editingProduct.oldPrice === '' ? 0 : Number(editingProduct.oldPrice),
        countInStock: editingProduct.countInStock === '' ? 0 : Number(editingProduct.countInStock),
        variants: editingProduct.variants.map(v => ({
            ...v, price: v.price === '' ? 0 : Number(v.price), oldPrice: v.oldPrice === '' ? 0 : Number(v.oldPrice), countInStock: v.countInStock === '' ? 0 : Number(v.countInStock)
        }))
      };
      await updateProduct(formattedProduct).unwrap();
      alert('Product updated successfully!');
      setIsFormOpen(false); setIsCreatingNew(false); window.scrollTo(0, 0);
    } catch (err) { alert('Failed to update product'); }
  };

  const handleCancelForm = async () => {
      if (isCreatingNew) {
         if (window.confirm('Discard this new product entirely?')) {
             await deleteProduct(editingProduct._id);
             setIsFormOpen(false); setIsCreatingNew(false);
         }
      } else { setIsFormOpen(false); }
  };

  const handleEditChange = (e) => setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const currentCount = editingProduct.images?.length || 0;
    if (files.length + currentCount > 7) { alert(`Maximum 7 images allowed. You can only add ${7 - currentCount} more.`); return; }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
    setUploading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', headers: token ? { authorization: `Bearer ${token}` } : {}, body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json(); 
      const updatedImages = [...(editingProduct.images || []), ...data];
      setEditingProduct({ ...editingProduct, images: updatedImages, img: updatedImages[0] || '' });
      e.target.value = null;
    } catch (error) { alert('Image upload failed.'); } finally { setUploading(false); }
  };

  const handleRemoveMainImage = (imageIndex) => {
    const newImages = editingProduct.images.filter((_, i) => i !== imageIndex);
    setEditingProduct({ ...editingProduct, images: newImages, img: newImages.length > 0 ? newImages[0] : '' });
  };

  const handleAddVariant = () => setEditingProduct({ ...editingProduct, variants: [...editingProduct.variants, { color: '', size: '', description: '', price: editingProduct.price || '', oldPrice: '', countInStock: '', images: [] }] });
  const handleRemoveVariant = (indexToRemove) => setEditingProduct({ ...editingProduct, variants: editingProduct.variants.filter((_, index) => index !== indexToRemove) });
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...editingProduct.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  const handleVariantFileUpload = async (e, variantIndex) => {
      const files = e.target.files;
      const currentCount = editingProduct.variants[variantIndex].images?.length || 0;
      if (files.length + currentCount > 4) { alert(`Maximum 4 images per variant. You can only add ${4 - currentCount} more.`); return; }
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
      setUploading(true);
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', headers: token ? { authorization: `Bearer ${token}` } : {}, body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json(); 
        const updatedVariants = [...editingProduct.variants];
        updatedVariants[variantIndex].images = [...(updatedVariants[variantIndex].images || []), ...data];
        setEditingProduct({ ...editingProduct, variants: updatedVariants });
        e.target.value = null;
      } catch (error) { alert('Variant image upload failed.'); } finally { setUploading(false); }
  };

  const handleRemoveVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...editingProduct.variants];
    updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  const resolveImage = (imgSrc) => {
    if (!imgSrc) return '';
    return imgSrc.startsWith('/uploads') ? `${ASSET_BASE_URL}${imgSrc}` : imgSrc;
  };

  if (isLoading) return <div className="pt-32 text-center font-bold text-red-950/50">Loading Catalog...</div>;

  return (
    <main className="pt-28 pb-24 min-h-screen bg-surface bg-hero-glow relative fade-in">
      <div className="absolute inset-0 doodle-bg opacity-30 pointer-events-none z-0"></div>
      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {isFormOpen ? (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="mb-8">
              <button onClick={handleCancelForm} className="inline-flex items-center gap-2 text-sm font-bold text-red-950/50 hover:text-red-600 mb-4 transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Catalog
              </button>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-sm">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-red-950 tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-600 text-[36px]">edit_square</span> 
                    {editingProduct.title === '' || editingProduct.title === 'New Magical Toy' ? 'Draft New Toy' : 'Edit Toy Details'}
                  </h1>
                  <p className="text-red-950/50 font-bold mt-2">Update pricing, inventory, and product details below.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-red-50 shadow-sm">
              <form onSubmit={handleUpdateProductSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  
                  {/* Column 1 & 2: Main Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Product Title</label>
                      <input type="text" name="title" value={editingProduct.title} onChange={handleEditChange} required placeholder="e.g. Magic Flying Orb" className="w-full bg-red-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 font-bold text-red-950 text-lg transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Default Price (₹)</label>
                        <input type="number" name="price" value={editingProduct.price} onChange={handleEditChange} required placeholder="499" className="w-full bg-red-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 font-black text-red-600 text-xl transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">MRP / Old Price (₹)</label>
                        <input type="number" name="oldPrice" value={editingProduct.oldPrice} onChange={handleEditChange} placeholder="999" className="w-full bg-red-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 font-bold text-red-950/50 line-through text-xl transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Default Description</label>
                      <textarea name="description" rows="6" value={editingProduct.description} onChange={handleEditChange} placeholder="Describe the awesome features of this toy..." className="w-full bg-red-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 resize-none font-medium text-red-950/70 text-lg transition-all"></textarea>
                    </div>

                    {/* NEW: Editor's Pick / Popular Toggle */}
                    <div className="space-y-2 mt-4 p-6 bg-red-50/30 rounded-3xl border border-red-100 flex items-center justify-between shadow-sm">
                      <div>
                        <label className="text-lg font-black text-red-950 block">Editor's Pick (Popular Set)</label>
                        <span className="text-sm text-red-950/60 font-bold">Show this item in the "Explore Popular Sets" section on the Home Page.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input type="checkbox" name="isPopular" checked={editingProduct.isPopular || false} onChange={(e) => setEditingProduct({...editingProduct, isPopular: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-red-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 shadow-inner"></div>
                      </label>
                    </div>

                  </div>

                  {/* Column 3: Inventory & Media */}
                  <div className="space-y-6 bg-red-50/30 p-6 rounded-[2rem] border border-red-50">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Default Stock Count</label>
                      <input type="number" name="countInStock" value={editingProduct.countInStock} onChange={handleEditChange} required placeholder="50" className="w-full bg-white p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 font-black text-red-950 text-xl transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Toy Category</label>
                      <select name="tag" value={editingProduct.tag || ''} onChange={handleEditChange} className="w-full bg-white p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 font-bold text-red-950 transition-all cursor-pointer">
                        <option value="">Select Category...</option>
                        <option value="Soft Toys">Soft Toys</option>
                        <option value="Wooden Wonders">Wooden Wonders</option>
                        <option value="Remote Control Cars">Remote Control Cars</option>
                        <option value="Arts & Crafts">Arts & Crafts</option>
                        <option value="Mind Puzzles">Mind Puzzles</option>
                        <option value="Metal Machines">Metal Machines</option>
                        <option value="Outdoor Adventures">Outdoor Adventures</option>
                        <option value="Educational Games">Educational Games</option>
                        <option value="Building & STEM">Building & STEM</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Age Group</label>
                      <select name="category" value={editingProduct.category || ''} onChange={handleEditChange} className="w-full bg-white p-4 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none border border-red-50 font-bold text-red-950 transition-all cursor-pointer">
                        <option value="">Select Age Group...</option>
                        <option value="0-12 MO">0-12 MO</option>
                        <option value="12-36 MO">12-36 MO</option>
                        <option value="2-5 YRS">2-5 YRS</option>
                        <option value="5-7 YRS">5-7 YRS</option>
                        <option value="7-10 YRS">7-10 YRS</option>
                        <option value="10-14 YRS">10-14 YRS</option>
                        <option value="14+ YRS">14+ YRS</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-red-950/40 uppercase tracking-widest ml-1">Upload Main Images (Max 7)</label>
                      <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="w-full bg-white p-4 rounded-2xl border text-sm cursor-pointer" />
                      {editingProduct.images && editingProduct.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {editingProduct.images.map((img, idx) => (
                            <div key={idx} className="rounded-xl border bg-white p-1 shadow-sm aspect-square relative group">
                              {idx === 0 && <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold z-10 shadow-sm pointer-events-none">Main</span>}
                              <img src={resolveImage(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                              <button type="button" onClick={() => handleRemoveMainImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10 shadow-md" title="Remove Image">&times;</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- VARIANTS SECTION --- */}
                <div className="mt-12 pt-8 border-t-2 border-red-100">
                   <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-2xl font-black text-red-950">Product Variants (Colors & Sizes)</h3>
                        <p className="text-sm font-bold text-red-950/50 mt-1">Add combinations of colors and sizes. Leave blank if not applicable.</p>
                     </div>
                     <button type="button" onClick={handleAddVariant} className="bg-red-100 text-red-700 px-6 py-3 rounded-xl text-sm font-black hover:bg-red-200 transition-colors shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Variant
                     </button>
                   </div>
                   {editingProduct.variants.length === 0 ? (
                       <div className="text-center p-8 bg-red-50/50 rounded-3xl border border-red-50 border-dashed">
                           <span className="material-symbols-outlined text-red-200 text-4xl mb-2">style</span>
                           <p className="text-red-950/40 font-bold">No variants added yet. This product will use default pricing and images.</p>
                       </div>
                   ) : (
                       <div className="space-y-6">
                         {editingProduct.variants.map((variant, index) => (
                           <div key={index} className="bg-white p-8 rounded-[2rem] border border-red-100 shadow-sm relative group">
                             <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute top-6 right-6 text-red-500 hover:text-white font-bold text-sm bg-red-50 hover:bg-red-600 px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                             </button>
                             <h4 className="text-lg font-black text-red-950 mb-6 flex items-center gap-2">
                                <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">{index + 1}</span> Variant Details
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-xs font-black text-red-950/60 uppercase tracking-widest ml-1">Color (e.g. Red)</label>
                                     <input type="text" value={variant.color || ''} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} placeholder="Leave blank if none" className="w-full bg-red-50/30 p-4 rounded-2xl border border-red-50 outline-none focus:ring-2 focus:ring-red-600 mt-2 font-bold text-red-950" />
                                  </div>
                                  <div>
                                     <label className="text-xs font-black text-red-950/60 uppercase tracking-widest ml-1">Size/Height (e.g. XL)</label>
                                     <input type="text" value={variant.size || ''} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} placeholder="Leave blank if none" className="w-full bg-red-50/30 p-4 rounded-2xl border border-red-50 outline-none focus:ring-2 focus:ring-red-600 mt-2 font-bold text-red-950" />
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs font-black text-red-950/60 uppercase tracking-widest ml-1">Price</label>
                                    <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} required className="w-full bg-red-50/30 p-4 rounded-2xl border border-red-50 outline-none focus:ring-2 focus:ring-red-600 mt-2 font-black text-red-600" />
                                  </div>
                                  <div>
                                    <label className="text-xs font-black text-red-950/60 uppercase tracking-widest ml-1">Stock</label>
                                    <input type="number" value={variant.countInStock} onChange={(e) => handleVariantChange(index, 'countInStock', e.target.value)} required className="w-full bg-red-50/30 p-4 rounded-2xl border border-red-50 outline-none focus:ring-2 focus:ring-red-600 mt-2 font-black text-red-950" />
                                  </div>
                               </div>
                             </div>
                             <div className="mb-6">
                                 <label className="text-xs font-black text-red-950/60 uppercase tracking-widest ml-1">Specific Description</label>
                                 <textarea value={variant.description} onChange={(e) => handleVariantChange(index, 'description', e.target.value)} className="w-full bg-red-50/30 p-4 rounded-2xl border border-red-50 outline-none focus:ring-2 focus:ring-red-600 mt-2 resize-none h-24 font-medium text-red-950/70" placeholder="Unique details about this specific variant..."></textarea>
                             </div>
                             <div className="bg-red-50/30 p-4 rounded-2xl border border-red-50">
                               <label className="text-xs font-black text-red-950/60 uppercase tracking-widest ml-1 block mb-3">Upload Variant Images (Max 4)</label>
                               <input type="file" multiple accept="image/*" onChange={(e) => handleVariantFileUpload(e, index)} disabled={uploading} className="w-full text-sm cursor-pointer" />
                               {variant.images && variant.images.length > 0 && (
                                 <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                   {variant.images.map((img, i) => (
                                     <div key={i} className="relative shrink-0 group/img">
                                       <img src={resolveImage(img)} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-red-100 mix-blend-multiply bg-white" />
                                       <button type="button" onClick={() => handleRemoveVariantImage(index, i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-700 shadow-md z-10" title="Remove Image">&times;</button>
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                   )}
                </div>

                <div className="pt-8 mt-8 border-t border-red-50 flex gap-4">
                  <button type="button" onClick={handleCancelForm} className="px-8 py-4 bg-red-50 text-red-950/60 font-black text-lg rounded-2xl hover:bg-red-100 transition-all">Cancel</button>
                  <button type="submit" disabled={isUpdating || uploading} className="flex-1 py-4 bg-red-600 text-white font-black text-lg rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:-translate-y-1 disabled:opacity-50">
                    {isUpdating ? 'Saving to Database...' : 'Save Product Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="mb-8">
              <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-950/50 hover:text-red-600 mb-4 transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Dashboard
              </Link>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-sm">
                <div><h1 className="text-3xl md:text-4xl font-black text-red-950 tracking-tight">Inventory Catalog</h1></div>
                <button onClick={handleCreateProduct} disabled={isCreating} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-md shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 w-full md:w-auto">
                  <span className="material-symbols-outlined">add_circle</span> Add New Toy
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-red-950/40">search</span>
                <input type="text" placeholder="Search catalog by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/80 border border-white shadow-sm pl-12 pr-4 py-3 rounded-full font-medium focus:ring-2 focus:ring-red-600 outline-none transition-all text-red-950 placeholder:text-red-950/40" />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-red-50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-red-50/50 border-b border-red-50">
                      <th className="p-5 text-xs font-black text-red-950/40 uppercase tracking-wider pl-8 w-24">Image</th>
                      <th className="p-5 text-xs font-black text-red-950/40 uppercase tracking-wider">Product Name</th>
                      <th className="p-5 text-xs font-black text-red-950/40 uppercase tracking-wider">Price</th>
                      <th className="p-5 text-xs font-black text-red-950/40 uppercase tracking-wider">Stock Status</th>
                      <th className="p-5 text-xs font-black text-red-950/40 uppercase tracking-wider">Tags & Popular</th>
                      <th className="p-5 text-xs font-black text-red-950/40 uppercase tracking-wider pr-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product._id} className="hover:bg-red-50/30 transition-colors border-b border-red-50 group">
                        <td className="p-5 pl-8">
                          <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm border border-red-50 p-1">
                            <img src={resolveImage(product.img)} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-red-950 text-sm max-w-[250px] truncate" title={product.title}>{product.title}</p>
                          <p className="text-xs font-mono text-red-950/40 mt-1">ID: ...{product._id.substring(product._id.length - 6)}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-black text-red-950">₹{product.price}</p>
                          {product.oldPrice > 0 && <p className="text-xs text-red-950/40 line-through">₹{product.oldPrice}</p>}
                        </td>
                        <td className="p-5">
                          {product.countInStock > 10 ? (
                            <span className="bg-green-50 text-green-700 text-xs font-black px-3 py-1.5 rounded-full border border-green-200 shadow-sm flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">inventory</span> {product.countInStock} Default
                            </span>
                          ) : product.countInStock > 0 ? (
                            <span className="bg-orange-50 text-orange-700 text-xs font-black px-3 py-1.5 rounded-full border border-orange-200 shadow-sm flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">warning</span> Low: {product.countInStock} Default
                            </span>
                          ) : (
                            <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">error</span> Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="p-5">
                          <span className="bg-white text-red-950/70 text-xs font-bold px-3 py-1 rounded-full border border-red-100">{product.tag || 'No Category'}</span>
                          {product.isPopular && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm mt-1.5 ml-2 inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">star</span> Popular
                            </span>
                          )}
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { 
                                setEditingProduct({ 
                                  ...product, 
                                  title: product.title === 'New Magical Toy' ? '' : product.title,
                                  price: product.price === 0 ? '' : product.price,
                                  oldPrice: product.oldPrice === 0 ? '' : product.oldPrice,
                                  countInStock: product.countInStock === 0 ? '' : product.countInStock,
                                  isPopular: product.isPopular || false,
                                  images: product.images || [],
                                  variants: product.variants || []
                                }); 
                                setIsCreatingNew(false); setIsFormOpen(true); window.scrollTo(0, 0); 
                              }}
                              className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm border border-red-100"
                              title="Edit Details"
                            ><span className="material-symbols-outlined text-[18px]">edit</span></button>
                            <button onClick={() => handleDeleteProduct(product._id)} disabled={isDeleting} className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm border border-red-100 disabled:opacity-50" title="Delete Toy">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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