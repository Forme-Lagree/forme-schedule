import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Plus, Download, RefreshCw, Save, FolderOpen } from 'lucide-react';
import Layout from '../Layout';
import StoryCanvas from '../components/schedule/StoryCanvas';
import InstructorBlock from '../components/schedule/InstructorBlock';
import { toast } from "sonner";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleBuilder() {
  const canvasRef = useRef(null);
  const [day, setDay] = useState('Sunday');
  const [blocks, setBlocks] = useState([{ id: Date.now(), instructorId: '', times: [] }]);
  const [isDownloading, setIsDownloading] = useState(false);

  // We'll use your local JSON/State instead of the Base44 API
  const instructors = []; // This will pull from your entities/Instructor.json later
  const backgroundUrl = ''; // You can paste a direct image URL here later

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

  const entries = blocks
    .filter(b => b.instructorId && b.times.length > 0)
    .map(b => {
      const inst = instructors.find(i => i.id === b.instructorId);
      return {
        instructor_id: b.instructorId,
        instructor_name: inst?.name || 'Instructor',
        instructor_image: inst?.profile_image || '',
        time_slots: b.times
      };
    });

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      const output = await html2canvas(canvas, { useCORS: true, scale: 2 });
      const link = document.createElement('a');
      link.download = `Forme-Schedule-${day}.png`;
      link.href = output.toDataURL();
      link.click();
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Download failed.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Layout currentPageName="ScheduleBuilder">
      <div className="min-h-screen bg-[#111] text-white flex flex-col items-center p-5">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
        
        <div className="w-full max-w-[720px] mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-2xl tracking-wider font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Schedule Builder</p>
              <p className="text-xs opacity-60 uppercase tracking-widest">Design Mode</p>
            </div>
            
            <select 
              value={day} 
              onChange={(e) => setDay(e.target.value)}
              className="bg-white/10 border border-white/20 p-2 rounded-xl text-white outline-none"
            >
              {DAYS.map(d => <option key={d} value={d} className="bg-black">{d}</option>)}
            </select>
          </div>

          <div className="space-y-4 mb-6">
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

          <div className="grid grid-cols-1 gap-3">
            <button onClick={addBlock} className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" /> Add Instructor
            </button>
            <button 
              onClick={handleDownload}
              disabled={isDownloading || entries.length === 0}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 flex items-center justify-center transition-all"
            >
              {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5 mr-2" /> Export to Phone</>}
            </button>
          </div>
        </div>

        {/* The Actual Canvas Component */}
        <div className="transform scale-[0.6] sm:scale-100 origin-top">
          <StoryCanvas 
            ref={canvasRef}
            day={day}
            entries={entries}
            backgroundUrl={backgroundUrl}
            compressed={entries.length > 4}
          />
        </div>
      </div>
    </Layout>
  );
}
