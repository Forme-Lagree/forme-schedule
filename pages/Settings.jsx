import React, { useState } from 'react';
import { Upload, Check, RefreshCw, Palette } from 'lucide-react';
import Layout from '../Layout';

export default function Settings() {
  const [imageUrl, setImageUrl] = useState('');
  const defaultBg = 'https://images.squarespace-cdn.com/content/67e8a9cb18b2066f3f0b0b49/5ae755c3-4f3e-4906-bc12-edc9adb4a840/Forme+Schedules+%2811%29.png?content-type=image%2Fpng';

  const currentBackground = imageUrl || defaultBg;

  const handleUrlSave = () => {
    // In this standalone version, we save to local storage so the browser remembers it
    localStorage.setItem('forme_bg', imageUrl);
    alert('Background saved to this browser!');
  };

  const resetToDefault = () => {
    setImageUrl('');
    localStorage.removeItem('forme_bg');
  };

  return (
    <Layout currentPageName="Settings">
      <div className="min-h-screen bg-[#111] text-white p-6">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-wider" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Theme Settings
            </h1>
            <p className="text-white/60 text-sm mt-1">Customize your schedule canvas background</p>
          </div>

          <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Canvas Background
                </h2>
                <p className="text-sm text-white/60">The background image used for your schedule exports</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <p className="text-sm text-white/70 mb-3">Current Background</p>
                <div 
                  className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 relative"
                  style={{
                    backgroundImage: `url('${currentBackground}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>

              {/* URL Input Section */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 mb-2">Image URL</p>
                  <div className="flex gap-2">
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="bg-white/10 border border-white/20 text-white rounded-xl flex-1 px-4 py-2 outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={handleUrlSave}
                      className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded-xl transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetToDefault}
                  className="w-full border border-white/20 text-white hover:bg-white/10 py-3 rounded-xl mt-4 flex items-center justify-center transition-all"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-200/80 text-sm">
              <strong>Tip:</strong> For best results, use a 1080×1920 pixel image. The background will be visible behind the glass card on your schedule.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
