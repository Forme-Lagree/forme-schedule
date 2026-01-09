import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Upload, User, X, Check, ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: instructors = [], isLoading } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => base44.entities.Instructor.list('name'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Instructor.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor added');
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Instructor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor updated');
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Instructor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor deleted');
      setDeleteDialogOpen(false);
      setInstructorToDelete(null);
    },
  });

  const openAddDialog = () => {
    setEditingInstructor(null);
    setName('');
    setImageUrl('');
    setDialogOpen(true);
  };

  const openEditDialog = (instructor) => {
    setEditingInstructor(instructor);
    setName(instructor.name);
    setImageUrl(instructor.profile_image || '');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingInstructor(null);
    setName('');
    setImageUrl('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const data = {
      name: name.trim(),
      profile_image: imageUrl,
      is_active: true
    };

    if (editingInstructor) {
      updateMutation.mutate({ id: editingInstructor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = (instructor) => {
    setInstructorToDelete(instructor);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-wider" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Instructor Management
            </h1>
            <p className="text-white/60 text-sm mt-1">Add, edit, or remove instructors</p>
          </div>
          <Button 
            onClick={openAddDialog}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Instructor
          </Button>
        </div>

        {/* Instructor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-20">
            <User className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No instructors yet</p>
            <Button onClick={openAddDialog} className="mt-4 bg-white/10 hover:bg-white/20">
              Add your first instructor
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructors.map(instructor => (
              <div 
                key={instructor.id}
                className="group relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  backdropFilter: 'blur(14px)'
                }}
              >
                <div className="aspect-square relative">
                  {instructor.profile_image ? (
                    <img 
                      src={instructor.profile_image} 
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <User className="w-20 h-20 text-white/20" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => openEditDialog(instructor)}
                      className="rounded-full border-white/30 bg-white/10 hover:bg-white/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => confirmDelete(instructor)}
                      className="rounded-full border-red-400/50 bg-red-500/20 hover:bg-red-500/40 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {instructor.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {editingInstructor ? 'Edit Instructor' : 'Add Instructor'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {/* Image Preview/Upload */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30" />
                  </div>
                )}
                
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </label>
              </div>
              <p className="text-xs text-white/50 mt-2">Click to upload image</p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter instructor name"
                className="bg-white/10 border-white/20 text-white rounded-xl"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={closeDialog}
                className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete {instructorToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(instructorToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
