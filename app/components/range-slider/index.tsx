'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  className?: string;
}

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  className = '',
}: RangeSliderProps) {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(newMin);
    onChange([newMin, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(newMax);
    onChange([minValue, newMax]);
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={`relative h-12 w-full ${className}`}>
      <div className="absolute top-1/2 h-1.5 w-full bg-gray-200 rounded-full -translate-y-1/2" />
      <motion.div
        className="absolute top-1/2 h-1.5 bg-[#43896B] rounded-full -translate-y-1/2"
        initial={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        animate={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <motion.div
        className={`absolute top-1/2 w-5 h-5 bg-[#43896B] rounded-full shadow-md -translate-y-1/2 -translate-x-1/2 cursor-pointer ${
          isDragging === 'min' ? 'ring-2 ring-[#43896B] ring-opacity-50 scale-110' : ''
        }`}
        style={{ left: `${minPos}%` }}
        drag="x"
        dragConstraints={{ left: 0, right: maxPos }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setIsDragging('min')}
        onDragEnd={() => setIsDragging(null)}
        onDrag={(_, info) => {
          const newPos = info.point.x;
          const sliderWidth = info.offset.x * (100 / minPos);
          const newMinPos = (newPos / sliderWidth) * 100;
          const newMinValue = Math.min(
            Math.round(min + (newMinPos / 100) * (max - min)),
            maxValue - step
          );
          setMinValue(newMinValue);
          onChange([newMinValue, maxValue]);
        }}
        whileHover={{ scale: 1.1 }}
      />
      <motion.div
        className={`absolute top-1/2 w-5 h-5 bg-[#43896B] rounded-full shadow-md -translate-y-1/2 -translate-x-1/2 cursor-pointer ${
          isDragging === 'max' ? 'ring-2 ring-[#43896B] ring-opacity-50 scale-110' : ''
        }`}
        style={{ left: `${maxPos}%` }}
        drag="x"
        dragConstraints={{ left: minPos, right: 100 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setIsDragging('max')}
        onDragEnd={() => setIsDragging(null)}
        onDrag={(_, info) => {
          const newPos = info.point.x;
          const sliderWidth = info.offset.x * (100 / maxPos);
          const newMaxPos = (newPos / sliderWidth) * 100;
          const newMaxValue = Math.max(
            Math.round(min + (newMaxPos / 100) * (max - min)),
            minValue + step
          );
          setMaxValue(newMaxValue);
          onChange([minValue, newMaxValue]);
        }}
        whileHover={{ scale: 1.1 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      {isDragging === 'min' && (
        <motion.div
          className="absolute px-2 py-1 bg-[#43896B] text-white text-xs rounded -translate-y-8 -translate-x-1/2"
          style={{ left: `${minPos}%` }}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: -8, opacity: 1 }}
          exit={{ y: -5, opacity: 0 }}
        >
          {minValue}
        </motion.div>
      )}
      {isDragging === 'max' && (
        <motion.div
          className="absolute px-2 py-1 bg-[#43896B] text-white text-xs rounded -translate-y-8 -translate-x-1/2"
          style={{ left: `${maxPos}%` }}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: -8, opacity: 1 }}
          exit={{ y: -5, opacity: 0 }}
        >
          {maxValue}
        </motion.div>
      )}
    </div>
  );
}