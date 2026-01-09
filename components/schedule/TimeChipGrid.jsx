import React from 'react';

const TIME_SLOTS = [
  "6:15 - 7:00 AM", "2:15 - 3:00 PM", "6:30 - 7:15 AM", "2:30 - 3:15 PM", 
  "7:15 - 8:00 AM", "3:15 - 4:00 PM", "7:30 - 8:15 AM", "3:30 - 4:15 PM", 
  "8:15 - 9:00 AM", "4:15 - 5:00 PM", "8:30 - 9:15 AM", "4:30 - 5:15 PM",
  "9:15 - 10:00 AM", "5:15 - 6:00 PM", "9:30 - 10:15 AM", "5:30 - 6:15 PM", 
  "10:15 - 11:00 AM", "6:15 - 7:00 PM", "10:30 - 11:15 AM", "6:30 - 7:15 PM", 
  "11:15 - 12:00 PM", "7:15 - 8:00 PM", "11:30 - 12:15 PM", "7:30 - 8:15 PM",
  "12:15 - 1:00 PM", "8:15 - 9:00 PM", "12:30 - 1:15 PM", "8:30 - 9:15 PM", 
  "1:15 - 2:00 PM", " ", "1:30 - 2:15 PM", " "
];

export default function TimeChipGrid({ selectedTimes, onToggle }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {TIME_SLOTS.map((time, index) => {
        if (time.trim() === '') {
          return <div key={index} className="h-10" />;
        }
        
        const isSelected = selectedTimes.includes(time);
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => onToggle(time)}
            className={`
              px-2 py-2.5 text-[10px] tracking-wide text-center rounded-xl cursor-pointer
              transition-all duration-150 select-none
              ${isSelected 
                ? 'bg-white text-black font-bold border border-white/65' 
                : 'bg-white/[0.07] border border-white/12 text-white/90 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5'
              }
            `}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}

export { TIME_SLOTS };
