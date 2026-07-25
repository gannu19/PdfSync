'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mic, MicOff, AlertCircle, X, Send, Keyboard, Sparkles } from "lucide-react";
import useVapi, { CallStatus } from "@/hooks/useVapi";
import { IBook } from "@/types";
import { formatDuration } from "@/lib/utils";

interface VapiControlsProps {
    book: IBook;
}

const getStatusLabel = (status: CallStatus) => {
    switch (status) {
        case 'connecting': return 'Connecting...';
        case 'starting': return 'Starting...';
        case 'listening': return 'Listening';
        case 'thinking': return 'Thinking...';
        case 'speaking': return 'Speaking...';
        default: return 'Ready';
    }
};

const getStatusDotClass = (status: CallStatus) => {
    switch (status) {
        case 'connecting': return 'vapi-status-dot-connecting';
        case 'starting': return 'vapi-status-dot-starting';
        case 'listening': return 'vapi-status-dot-listening';
        case 'thinking': return 'vapi-status-dot-thinking';
        case 'speaking': return 'vapi-status-dot-speaking';
        default: return 'vapi-status-dot-ready';
    }
};

const VapiControls = ({ book }: VapiControlsProps) => {
    const {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        limitError,
        start,
        stop,
        sendMessage,
        clearErrors,
    } = useVapi(book);

    const [textInput, setTextInput] = useState('');

    const personaName = book.persona || 'Default Voice';

    const handleMicClick = () => {
        if (isActive) {
            stop();
        } else {
            start();
        }
    };

    const handleSend = (text?: string) => {
        const query = text || textInput.trim();
        if (!query) return;
        sendMessage(query);
        if (!text) setTextInput('');
    };

    const quickSuggestions = [
        `Summarize "${book.title}"`,
        `Who is ${book.author}?`,
        `Key takeaways`,
    ];

    return (
        <div className="vapi-main-container space-y-6 w-full">
            {/* SECTION 1: HEADER CARD */}
            <section className="vapi-header-card w-full shadow-lg border border-[#e8d5b5]/60 transition-all hover:shadow-xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full z-10">
                    
                    {/* Left: Book Cover Image + Overlapping Mic Button */}
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'}
                            alt={book.title}
                            width={130}
                            height={195}
                            unoptimized={Boolean(book.coverURL?.startsWith('data:'))}
                            className="vapi-cover-image w-[120px] h-[180px] sm:w-[130px] sm:h-[195px] rounded-xl object-cover border border-black/5"
                        />

                        {/* Circular white mic button (60px) overlapping cover bottom-right */}
                        <div className="vapi-mic-wrapper">
                            {isActive && <div className="vapi-pulse-ring" />}
                            <button
                                type="button"
                                onClick={handleMicClick}
                                className={`vapi-mic-btn shadow-md ${
                                    isActive ? 'vapi-mic-btn-active bg-[#212a3b]' : 'vapi-mic-btn-inactive bg-white'
                                }`}
                                title={isActive ? 'Click to stop session' : 'Click to start talking'}
                                aria-label={isActive ? 'Stop talking' : 'Start talking'}
                            >
                                {isActive ? (
                                    <Mic className="w-6 h-6 text-white animate-pulse" />
                                ) : (
                                    <MicOff className="w-6 h-6 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right of Cover: Title, Author, Badges */}
                    <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-between py-1">
                        <div>
                            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#212a3b] leading-tight tracking-tight line-clamp-2">
                                {book.title}
                            </h1>
                            <p className="text-base sm:text-lg text-[#3d485e] font-medium mt-1">
                                by {book.author}
                            </p>
                        </div>

                        {/* Row of three small white pill badges */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                            {/* 1. Status Indicator */}
                            <div className="vapi-status-indicator shadow-sm border border-[#e5d9c5]">
                                <span className={`vapi-status-dot ${getStatusDotClass(status)}`} />
                                <span className="vapi-status-text">
                                    {getStatusLabel(status)}
                                </span>
                            </div>

                            {/* 2. Voice Label */}
                            <div className="vapi-status-indicator shadow-sm border border-[#e5d9c5]">
                                <span className="vapi-status-text">
                                    Voice: {personaName}
                                </span>
                            </div>

                            {/* 3. Timer */}
                            <div className="vapi-status-indicator shadow-sm border border-[#e5d9c5]">
                                <span className="vapi-status-text font-mono">
                                    {formatDuration(duration)}/15:00
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Limit Error Banner if present */}
            {limitError && (
                <div className="error-banner">
                    <div className="error-banner-content">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="error-banner-icon" />
                            <span className="text-sm font-medium text-red-700">{limitError}</span>
                        </div>
                        <button onClick={clearErrors} className="error-banner-dismiss">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* SECTION 2: TRANSCRIPT AREA */}
            <section className="vapi-transcript-wrapper w-full">
                <div className="transcript-container border border-[#e2d8c3]/80 shadow-md flex flex-col justify-between overflow-hidden bg-white rounded-xl min-h-[400px]">
                    
                    {messages.length === 0 && !currentMessage && !currentUserMessage ? (
                        /* EMPTY TRANSCRIPT STATE */
                        <div className="transcript-empty p-8 my-auto flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="w-16 h-16 rounded-full bg-[#f8f4e9] border border-[#e8d5b5] flex items-center justify-center shadow-inner transition-transform hover:scale-105">
                                    <Mic className="w-8 h-8 text-[#212a3b]" />
                                </div>
                            </div>
                            <h3 className="transcript-empty-text">
                                No conversation yet
                            </h3>
                            <p className="transcript-empty-hint">
                                Click the mic button above to start talking
                            </p>

                            {/* Quick Topic Chips */}
                            <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md">
                                {quickSuggestions.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(prompt)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#fcfaf5] hover:bg-[#f3e4c7] text-[#212a3b] px-3 py-1.5 rounded-lg border border-[#e8d5b5] transition-colors"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-[#8B7355]" />
                                        <span>{prompt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* MESSAGES & TRANSCRIPT LIST */
                        <div className="transcript-messages flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`transcript-message ${
                                        msg.role === 'user' ? 'transcript-message-user' : 'transcript-message-assistant'
                                    }`}
                                >
                                    <div
                                        className={`transcript-bubble ${
                                            msg.role === 'user'
                                                ? 'transcript-bubble-user bg-[#663820] text-white shadow-sm'
                                                : 'transcript-bubble-assistant bg-[#f3e4c7] text-[#212a3b] border border-[#e2d4b7] shadow-sm'
                                        }`}
                                    >
                                        <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {currentUserMessage && (
                                <div className="transcript-message transcript-message-user">
                                    <div className="transcript-bubble transcript-bubble-user bg-[#663820] text-white shadow-sm">
                                        <p className="text-sm sm:text-base leading-relaxed">{currentUserMessage}</p>
                                    </div>
                                </div>
                            )}

                            {currentMessage && (
                                <div className="transcript-message transcript-message-assistant">
                                    <div className="transcript-bubble transcript-bubble-assistant bg-[#f3e4c7] text-[#212a3b] border border-[#e2d4b7] flex items-center gap-2">
                                        <p className="text-sm sm:text-base leading-relaxed">{currentMessage}</p>
                                        <span className="transcript-cursor" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TEXT INPUT BAR - TYPE INSTEAD OF SPEAKING */}
                    <div className="p-4 bg-[#fcfaf7] border-t border-[#eee6d8] flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1 bg-white border border-[#e2d8c3] rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#663820]/30 transition-all shadow-sm">
                            <Keyboard className="w-5 h-5 text-[#8B7355] shrink-0" />
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={`Type your message or question about "${book.title}"...`}
                                className="w-full text-sm bg-transparent text-[#212a3b] outline-none placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleSend()}
                            disabled={!textInput.trim()}
                            className="p-3 bg-[#663820] hover:bg-[#7a4528] disabled:opacity-40 text-white rounded-xl transition-all shadow-sm cursor-pointer shrink-0 flex items-center justify-center"
                            title="Send text message"
                            aria-label="Send text message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default VapiControls;