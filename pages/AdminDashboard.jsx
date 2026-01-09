import React, { useState } from 'react';
import Layout from '../Layout';
import { Plus, Pencil, Trash2, Upload, User, ImageIcon } from 'lucide-react';
import { toast } from "sonner";

export default function AdminDashboard() {
  // Local state instead of Base44 database for now
  const [instructors, setInstructors] = useState([
    { id: 1, name: "Sample Instructor", profile_image: "" }
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  const openAddDialog = () => {
    setEditingInstructor(null);
    setName('');
    setImageUrl('');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    const newInstructor = {
      id: editingInstructor ? editingInstructor.id : Date.now(),
      name: name.trim(),
      profile_image: imageUrl
    };

    if (editingInstructor) {
      setInstructors(instructors.map(inst => inst.id === editingInstructor.id ? newInstructor : inst));
      toast.success('Instructor updated');
    } else {
      setInstructors([...instructors, newInstructor]);
      toast.success('Instructor added');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setInstructors(instructors.filter(inst => inst.id !== id));
    toast.success('Instructor removed');
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet" />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-wider" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Instructor Management
            </h1>
            <p className="text-white/60 text-sm mt-1">Add, edit, or remove instructors</p>
          </div>
          <button 
            onClick={openAddDialog}
            className="flex items-center bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Instructor
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map(instructor => (
            <div key={instructor.id} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="aspect-square relative">
                {instructor.profile_image ? (
                  <img src={instructor.profile_image} alt={instructor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <User className="w-20 h-20 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => { setEditingInstructor(instructor); setName(instructor.name); setImageUrl(instructor.profile_image); setDialogOpen(true); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(instructor.id)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{instructor.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Dialog Overlay */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#1a1a1a] border border-white/20 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {editingInstructor ? 'Edit Instructor' : 'Add Instructor'}
            </h2>
            <div className="space-y-4">
               <input 
                 type="text" 
                 placeholder="Instructor Name" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-white/10 border border-white/20 p-3 rounded-xl text-white outline-none focus:border-emerald-500"
               />
               <input 
                 type="text" 
                 placeholder="Image URL (e.g. https://...)" 
                 value={imageUrl}
                 onChange={(e) => setImageUrl(e.target.value)}
                 className="w-full bg-white/10 border border-white/20 p-3 rounded-xl text-white outline-none"
               />
               <div className="flex gap-2">
                 <button onClick={() => setDialogOpen(false)} className="flex-1 px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10">Cancel</button>
                 <button onClick={handleSave} className="flex-1 px-4 py-2 bg-emerald-600 rounded-xl hover:bg-emerald-700">Save</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
