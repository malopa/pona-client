import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, Check, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function HeroBannerManagement() {
  const [currentImage, setCurrentImage] = useState('https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=800&h=600');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleUpdateBanner = async () => {
    if (!newImageUrl) {
      setError('Please enter a valid image URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate image URL
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = newImageUrl;
      });

      // Update banner in database
      const { error: updateError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'hero_banner',
          value: newImageUrl
        });

      if (updateError) throw updateError;

      setCurrentImage(newImageUrl);
      setNewImageUrl('');
      setSuccess('Hero banner updated successfully');
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Failed to update banner. Please ensure the image URL is valid and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hero Banner Management</h2>
          <p className="text-gray-600">Update the main banner image on the desktop homepage</p>
        </div>
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            isPreviewMode
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-5 h-5" />
          {isPreviewMode ? 'Exit Preview' : 'Preview'}
        </button>
      </div>

      {isPreviewMode ? (
        <div className="relative bg-gradient-to-b from-emerald-50 to-white rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-20 pb-24 md:pt-28 md:pb-32">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative z-10">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Your Health Journey <br />
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                      Starts Here
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-lg">
                    Connect with qualified healthcare professionals anytime, anywhere. 
                    Get expert medical advice from the comfort of your home.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                               rounded-3xl transform rotate-3"></div>
                  <img
                    src={currentImage}
                    alt="Hero banner"
                    className="relative rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 
                             transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-lg flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Current Banner */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Banner</h3>
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={currentImage}
                    alt="Current banner"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Update Banner */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Banner</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Image URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateBanner}
                    disabled={isLoading || !newImageUrl}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                           py-3 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl
                           hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                           active:scale-98 flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Update Banner
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Image Guidelines */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Image Guidelines</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Recommended resolution: 1600x900 pixels</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• Supported formats: JPG, PNG</li>
                  <li>• Use high-quality, professional images</li>
                  <li>• Ensure proper licensing for commercial use</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}