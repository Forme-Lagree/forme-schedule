import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Image, Check, Trash2, RefreshCw, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Settings() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const defaultBg = 'https://images.squarespace-cdn.com/content/67e8a9cb18b2066f3f0b0b49/5ae755c3-4f3e-4906-bc12-edc9adb4a840/Forme+Schedules+%2811%29.png?content-type=image%2Fpng';

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  const backgroundSetting = settings.find(s => s.setting_key === 'background_image');
  const currentBackground = backgroundSetting?.setting_value || defaultBg;

  useEffect(() => {
    if (backgroundSetting) {
      setImageUrl(backgroundSetting.setting_value || '');
    }
  }, [backgroundSetting]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AppSettings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      toast.success('Background updated');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AppSettings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
      toast.success('Background updated');
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
      await saveBackground(file_url);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveBackground = async (url) => {
    if (backgroundSetting) {
      updateMutation.mutate({ 
        id: backgroundSetting.id, 
        data: { setting_value: url } 
      });
    } else {
      createMutation.mutate({
        setting_key: 'background_image',
        setting_value: url
      });
    }
  };

  const handleUrlSave = () => {
    saveBackground(imageUrl);
  };

  const resetToDefault = () => {
    setImageUrl('');
    saveBackground('');
    toast.success('Reset to default background');
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wider" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Theme Settings
          </h1>
          <p className="text-white/60 text-sm mt-1">Customize your schedule canvas background</p>
        </div>

        {/* Background Section */}
        <div 
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(14px)'
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Canvas Background
              </h2>
              <p className="text-sm text-white/60">Upload a 1080×1920 image for best results</p>
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
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/70 mb-3">Upload New Background</p>
                <label 
                  className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors cursor-pointer bg-white/5"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <RefreshCw className="w-10 h-10 animate-spin text-white/50" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-white/50 mb-2" />
                      <span className="text-sm text-white/50">Click to upload image</span>
                    </>
                  )}
                </label>
              </div>

              <div className="relative">
                <p className="text-xs text-white/50 text-center py-2">— or enter URL —</p>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-2">Image URL</p>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="bg-white/10 border-white/20 text-white rounded-xl flex-1"
                  />
                  <Button 
                    onClick={handleUrlSave}
                    disabled={updateMutation.isPending || createMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={resetToDefault}
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-200/80 text-sm">
            <strong>Tip:</strong> For best results, use a 1080×1920 pixel image. The background will be visible behind the glass card on your schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
