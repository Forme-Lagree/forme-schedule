import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import html2canvas from 'html2canvas';
import { Plus, Download, RefreshCw, Save, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import StoryCanvas from '@/components/schedule/StoryCanvas';
import InstructorBlock from '@/components/schedule/InstructorBlock';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleBuilder() {
  const queryClient = useQueryClient();
  const canvasRef = useRef(null);
  
  const [day, setDay] = useState('Sunday');
  const [blocks, setBlocks] = useState([{ id: Date.now(), instructorId: '', times: [] }]);
  const [scheduleName, setScheduleName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch instructors
  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => base44.entities.Instructor.list(),
  });

  // Fetch background setting
  const { data: settings = [] } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
  });

  // Fetch saved schedules
  const { data: savedSchedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => base44.entities.Schedule.list('-created_date'),
  });

  const backgroundUrl = settings.find(s => s.setting_key === 'background_image')?.setting_value || '';

  // Save schedule mutation
  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.Schedule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success('Schedule saved successfully');
      setSaveDialogOpen(false);
      setScheduleName('');
    },
  });

  const addBlock = () => {
    setBlocks([...blocks, { id: Date.now(), instructorId: '', times: [] }]);
  };

  const removeBlock = (id) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const toggleTime = (blockId, time) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      const times = b.times.includes(time) 
        ? b.times.filter(t => t !== time)
        : [...b.times, time];
      return { ...b, times };
    }));
  };

  // Build entries for canvas
  const entries = blocks
    .filter(b => b.instructorId && b.times.length > 0)
    .map(b => {
      const inst = instructors.find(i => i.id === b.instructorId);
      return {
        instructor_id: b.instructorId,
        instructor_name: inst?.name || '',
        instructor_image: inst?.profile_image || '',
        time_slots: b.times
      };
    });

  const compressed = entries.length > 4;

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    
    const canvas = canvasRef.current;
    const originalTransform = canvas.style.transform;
    canvas.style.transform = 'scale(1)';

    try {
      const output = await html2canvas(canvas, {
        useCORS: true,
        allowTaint: true,
        scale: 1.5
      });

      const link = document.createElement('a');
      link.download = `Forme-Schedule-${day}.png`;
      link.href = output.toDataURL();
      link.click();
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      canvas.style.transform = originalTransform;
      setIsDownloading(false);
    }
  };

  const handleSave = () => {
    if (!scheduleName.trim()) {
      toast.error('Please enter a schedule name');
      return;
    }

    saveMutation.mutate({
      name: scheduleName,
      day_of_week: day,
      entries: entries
    });
  };

  const handleLoad = (schedule) => {
    setDay(schedule.day_of_week);
    setBlocks(
      schedule.entries?.map((e, i) => ({
        id: Date.now() + i,
        instructorId: e.instructor_id,
        times: e.time_slots || []
      })) || [{ id: Date.now(), instructorId: '', times: [] }]
    );
    setLoadDialogOpen(false);
    toast.success('Schedule loaded');
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center p-5">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
      
      {/* Admin Panel */}
      <div className="w-full max-w-[720px] mb-6 p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 18px 60px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(1200px 400px at 20% 0%, rgba(255,255,255,0.10), transparent 60%)',
            opacity: 0.9
          }}
        />

        {/* Top Row */}
        <div className="relative z-10 flex gap-3 items-center justify-between mb-4">
          <div>
            <p className="text-lg tracking-wider opacity-95 m-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Schedule Builder
            </p>
            <p className="text-xs tracking-wide opacity-70 mt-0.5">
              Admin-only controls (export-ready)
            </p>
          </div>
          <div className="w-44">
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="bg-white/[0.07] border-white/16 text-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Builder Container */}
        <div className="relative z-10 flex flex-col gap-3 mb-4">
          {blocks.map(block => (
            <InstructorBlock
              key={block.id}
              instructors={instructors}
              selectedInstructor={block.instructorId}
              selectedTimes={block.times}
              onInstructorChange={(val) => updateBlock(block.id, 'instructorId', val)}
              onTimeToggle={(time) => toggleTime(block.id, time)}
              onRemove={() => removeBlock(block.id)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="relative z-10 grid grid-cols-1 gap-2.5">
          <Button
            variant="outline"
            onClick={addBlock}
            className="w-full py-3 rounded-xl border-white/14 bg-white/[0.08] text-white font-bold tracking-wide hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Instructor
          </Button>
          
          <div className="grid grid-cols-2 gap-2.5">
            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full py-3 rounded-xl border-white/14 bg-white/[0.08] text-white font-bold tracking-wide hover:bg-white/10"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Load
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a1a] border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>Load Saved Schedule</DialogTitle>
                </DialogHeader>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {savedSchedules.length === 0 ? (
                    <p className="text-white/60 text-center py-4">No saved schedules</p>
                  ) : (
                    savedSchedules.map(schedule => (
                      <button
                        key={schedule.id}
                        onClick={() => handleLoad(schedule)}
                        className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-all"
                      >
                        <p className="font-medium">{schedule.name}</p>
                        <p className="text-sm text-white/60">{schedule.day_of_week} • {schedule.entries?.length || 0} instructors</p>
                      </button>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full py-3 rounded-xl border-white/14 bg-white/[0.08] text-white font-bold tracking-wide hover:bg-white/10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a1a] border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle>Save Schedule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Schedule name"
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button 
                    onClick={handleSave} 
                    disabled={saveMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saveMutation.isPending ? 'Saving...' : 'Save Schedule'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            onClick={handleDownload}
            disabled={isDownloading || entries.length === 0}
            className="w-full py-3 rounded-xl bg-white text-black font-bold tracking-wide text-base hover:bg-white/90"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Story Canvas */}
      <StoryCanvas 
        ref={canvasRef}
        day={day}
        entries={entries}
        backgroundUrl={backgroundUrl}
        compressed={compressed}
      />
    </div>
  );
}
