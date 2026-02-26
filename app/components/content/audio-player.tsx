'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
    url?: string;
}

export default function AudioPlayer({ url }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fullUrl = url ? (url.startsWith('http') ? url : `https://test-admin.nahjalbalaghah.org${url}`) : null;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, [url]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        const newMutedState = !isMuted;
        audioRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (!url) return null;

    return (
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-3 hover:shadow-md transition-all group max-w-md w-full">
            <audio
                ref={audioRef}
                src={fullUrl || ''}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />
            <div className="flex items-center gap-3">
                <button
                    onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10; }}
                    className="text-gray-400 hover:text-[#43896B] transition-colors cursor-pointer"
                >
                    <SkipBack className="w-4 h-4" />
                </button>
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 flex items-center justify-center bg-[#43896B] hover:bg-[#367556] text-white rounded-full transition-all shadow-sm hover:scale-105 cursor-pointer"
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                </button>
                <button
                    onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10; }}
                    className="text-gray-400 hover:text-[#43896B] transition-colors cursor-pointer"
                >
                    <SkipForward className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div
                    className="relative h-1.5 w-full bg-gray-100 rounded-full cursor-pointer overflow-hidden"
                    onClick={(e) => {
                        if (!audioRef.current || duration === 0) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const clickedValue = (x / rect.width) * duration;
                        audioRef.current.currentTime = clickedValue;
                        setCurrentTime(clickedValue);
                    }}
                >
                    <div
                        className="absolute top-0 left-0 h-full bg-[#43896B] transition-all"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex items-center gap-3 ml-2">
                <button
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                    ) : (
                        <Volume2 className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
