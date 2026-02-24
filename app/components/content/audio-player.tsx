'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward, MoreHorizontal } from 'lucide-react';

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-3 hover:shadow-md transition-all group max-w-md w-full">
            <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-[#43896B] transition-colors cursor-pointer">
                    <SkipBack className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 flex items-center justify-center bg-[#43896B] hover:bg-[#367556] text-white rounded-full transition-all shadow-sm hover:scale-105 cursor-pointer"
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                </button>
                <button className="text-gray-400 hover:text-[#43896B] transition-colors cursor-pointer">
                    <SkipForward className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    <span>{isPlaying ? "0:42" : "0:00"}</span>
                    <span>5:24</span>
                </div>
                <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`absolute top-0 left-0 h-full bg-[#43896B] transition-all duration-1000 ${isPlaying ? 'w-[15%]' : 'w-0'}`}
                    ></div>
                </div>
            </div>
            <div className="flex items-center gap-3 ml-2">
                <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <Volume2 className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
