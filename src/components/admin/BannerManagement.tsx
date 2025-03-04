import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface Banner {
  id: number;
  image: string;
  title: string;
}

const defaultBanners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&h=300',
    title: 'Quality Healthcare for All'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=800&h=300',
    title: 'Early Detection of Diseases'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&h=300',
    title: 'Affordable Healthcare'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&h=300',
    title: 'Quality Healthcare Everywhere'
  }
];

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedBanners = localStorage.getItem('mobileBanners');
    setBanners(savedBanners ? JSON.parse(savedBanners) : defaultBanners);
  }, []);

  const handleAddBanner = () => {
    const newBanner = {
      id: Date.now(),
      image: '',
      title: ''
    };
    setBanners([...banners, newBanner]);
  };

  const handleRemoveBanner = (id: number) => {
    setBanners(banners.filter(banner => banner.id !== id));
  };

  const handleUpdateBanner = (id: number, field: keyof Banner, value: string) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, [field]: value } : banner
    ));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate banners
      const isValid = banners.every(banner => banner.image && banner.title);
      if (!isValid) {
        throw new Error('All banners must have both an image URL and title');
      }

      // Save to localStorage
      localStorage.setItem('mobileBanners', JSON.stringify(banners));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBanners(defaultBanners);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mobile Banner Management</h2>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600
                     hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleAddBanner}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white
                     rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={banner.image}
                    onChange={(e) => handleUpdateBanner(banner.id, 'image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => handleUpdateBanner(banner.id, 'title', e.target.value)}
                  placeholder="Banner Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {banner.image && (
              <div className="mt-4">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x300?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}

            <button
              onClick={() => handleRemoveBanner(banner.id)}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50
                       rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Remove Banner
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white
                   rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl
                   hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02]
                   active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}