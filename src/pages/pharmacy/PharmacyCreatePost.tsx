import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, Eye, CheckCircle, Tag, X, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PharmacyCreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPharmacyProduct, showToast, currentUser } = useApp();

  const [productName, setProductName] = useState('Azithromycin 500mg Tablets (Strip of 5)');
  const [companyName, setCompanyName] = useState('Cipla Ltd');
  const [category, setCategory] = useState('Pulmonology');
  const [mfgDate, setMfgDate] = useState('2026-01-15');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [contactNumber, setContactNumber] = useState('+91 94444 88990');
  const [email, setEmail] = useState('care@apollogreenmeds.in');
  const [originalPrice, setOriginalPrice] = useState(130);
  const [offerPrice, setOfferPrice] = useState(104);
  const [stockQuantity, setStockQuantity] = useState(250);
  const [location, setLocation] = useState('Anna Nagar West, Chennai');
  const [description, setDescription] = useState('Broad-spectrum macrolide antibiotic. Fresh manufacturing batch stored under controlled temperature 25°C.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountPercentage =
    originalPrice > 0 ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) : 0;

  const handlePublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const pharmacyName =
        currentUser && 'pharmacyName' in currentUser ? currentUser.pharmacyName : 'Apollo Green Meds';
      const pharmacyId =
        currentUser && 'pharmacyId' in currentUser ? currentUser.pharmacyId : 'TH-PH-1098';

      await addPharmacyProduct({
        pharmacyId,
        pharmacyName,
        productName: productName.trim(),
        companyName: companyName.trim() || 'Generic Pharma',
        category: category.trim() || 'General Care',
        mfgDate,
        expiryDate,
        contactNumber,
        email,
        originalPrice: Number(originalPrice) || 100,
        offerPrice: Number(offerPrice) || 80,
        discountPercentage: Math.max(0, discountPercentage),
        availableQuantity: Number(stockQuantity) || 100,
        location,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        stockStatus: stockQuantity > 20 ? 'Available' : 'Low Stock',
        isOffer: discountPercentage > 0,
      });

      showToast('Product successfully saved to Firestore & live in Marketplace!');
      navigate('/pharmacy/marketplace');
    } catch (err: any) {
      console.error('Failed to publish product:', err);
      showToast('Failed to save product to database. Please check fields and retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Marketplace Publication
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Create Medicine Product Post
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Broadcast inventory batches, wholesale discounts, and over-the-counter medicine lots to network pharmacies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs disabled:opacity-50"
          >
            Preview Post
          </button>
          <button
            type="button"
            onClick={() => handlePublish()}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors disabled:bg-slate-400"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Saving to Firestore...' : 'Publish Post'}</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handlePublish} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Photo Selection / Preset */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">Product Photo URL or Preset</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={() => showToast('Simulated image uploaded from camera/gallery')}
              className="px-4 py-2 font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Product / Medicine Name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Manufacturer / Pharma Company</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Therapeutic Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Diabetes Care">Diabetes Care</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Diagnostic Devices">Diagnostic Devices</option>
              <option value="Vitamins & Supplements">Vitamins & Supplements</option>
              <option value="Gastroenterology">Gastroenterology</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Available Stock Units</label>
            <input
              type="number"
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Manufacturing Date</label>
            <input
              type="date"
              value={mfgDate}
              onChange={(e) => setMfgDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-amber-700"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Original MRP Price (₹)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Offer / Wholesale Price (₹)</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-teal-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Calculated Discount</label>
            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg font-bold text-amber-900 font-mono">
              {discountPercentage}% Discount
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Contact Phone</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Store Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Store Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Product Description & Packaging</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
            />
          </div>
        </div>

        {/* Form Bottom Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/pharmacy/marketplace')}
            className="px-5 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Post to Feed</span>
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 text-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-900">Post Feed Card Preview</span>
              <button onClick={() => setShowPreviewModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{productName}</h4>
              <p className="text-slate-500">{companyName} · {category}</p>
              <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-bold text-teal-800">₹{offerPrice}</span>
                <span className="font-bold text-amber-700">{discountPercentage}% OFF</span>
              </div>
              <p className="text-slate-600 text-[11px]">{description}</p>
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 font-bold text-slate-700 bg-slate-100 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
