import React from 'react';
import { X } from 'lucide-react';
import TimeChipGrid from './TimeChipGrid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InstructorBlock({ 
  instructors, 
  selectedInstructor, 
  selectedTimes, 
  onInstructorChange, 
  onTimeToggle, 
  onRemove 
}) {
  return (
    <div className="p-4 rounded-2xl bg-black/20 border border-white/12 flex flex-col gap-3">
      <div className="flex gap-2.5 items-center">
        <Select value={selectedInstructor} onValueChange={onInstructorChange}>
          <SelectTrigger className="flex-1 bg-white/[0.07] border-white/16 text-white rounded-xl h-11 text-sm">
            <SelectValue placeholder="Select instructor" />
          </SelectTrigger>
          <SelectContent>
            {instructors.map(inst => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <button
          type="button"
          onClick={onRemove}
          className="w-11 h-11 min-w-[44px] rounded-xl border border-white/14 bg-red-600/95 text-white font-extrabold cursor-pointer transition-all hover:brightness-105 active:translate-y-px flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <TimeChipGrid selectedTimes={selectedTimes} onToggle={onTimeToggle} />
    </div>
  );
}
