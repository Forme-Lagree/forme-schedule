import React from 'react';
import { X } from 'lucide-react';
import TimeChipGrid from './TimeChipGrid';

export default function InstructorBlock({ 
  instructors, 
  selectedInstructor, 
  selectedTimes, 
  onInstructorChange, 
  onTimeToggle, 
  onRemove 
}) {
  return (
    <div className="p-4 rounded-2xl bg-black/20 border border-white/10 flex flex-col gap-3">
      <div className="flex gap-2.5 items-center">
        {/* Swapped Base44 Select for a styled Standard Select */}
        <select 
          value={selectedInstructor} 
          onChange={(e) => onInstructorChange(e.target.value)}
          className="flex-1 bg-white/[0.07] border border-white/20 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-emerald-500 transition-all appearance-none"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
        >
          <option value="" className="bg-[#111]">Select instructor</option>
          {instructors.map(inst => (
            <option key={inst.id} value={inst.id} className="bg-[#111]">
              {inst.name}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={onRemove}
          className="w-11 h-11 min-w-[44px] rounded-xl border border-white/14 bg-red-600/90 text-white cursor-pointer transition-all hover:bg-red-600 active:scale-95 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <TimeChipGrid selectedTimes={selectedTimes} onToggle={onTimeToggle} />
    </div>
  );
}
