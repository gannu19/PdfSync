'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mic, MicOff, AlertCircle, X, Send, Keyboard, Sparkles, Trash2, Loader2 } from "lucide-react";
import useVapi, { CallStatus } from "@/hooks/useVapi";
import { IBook } from "@/types";
import { formatDuration } from "@/lib/utils";
import { deleteBook } from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BookOpen } from "lucide-react";

interface VapiControlsProps {
    book: IBook;
    onPageCitationClick?: (pageNum: number) => void;
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

const VapiControls = ({ book, onPageCitationClick }: VapiControlsProps) => {
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const personaName = book.persona || 'Default Voice';

    // Auto-detect citation in latest AI message and jump PDF viewer!
    React.useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
            const match = lastMsg.content.match(/\[Page\s*(\d+)\]/i);
            if (match && match[1] && onPageCitationClick) {
                const pageNum = parseInt(match[1], 10);
                onPageCitationClick(pageNum);
            }
        }
    }, [messages, onPageCitationClick]);

    // Also auto-detect citations while streaming currentMessage!
    React.useEffect(() => {
        if (currentMessage) {
            const match = currentMessage.match(/\[Page\s*(\d+)\]/i);
            if (match && match[1] && onPageCitationClick) {
                const pageNum = parseInt(match[1], 10);
                onPageCitationClick(pageNum);
            }
        }
    }, [currentMessage, onPageCitationClick]);

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

    const handleDeleteBook = async () => {
        try {
            setIsDeleting(true);
            const res = await deleteBook(book._id);
            if (res.success) {
                toast.success("Book deleted successfully");
                router.push('/');
            } else {
                toast.error(res.message || "Failed to delete book");
                setIsDeleting(false);
                setShowDeleteModal(false);
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Something went wrong deleting the book");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const quickSuggestions = [
        `Summarize "${book.title}"`,
        `Who is ${book.author}?`,
        `Key takeaways`,
    ];

    return (
        <div className="space-y-6 w-full">
            {/* SECTION 1: HEADER & MIC CONTROL BAR */}
            <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                    
                    {/* Left: Book Cover Image & Mic Button Overlay */}
                    <div className="relative group shrink-0">
                        <div className="relative h-44 w-32 md:h-52 md:w-36 overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-lg">
                            <Image
                                src={book.coverURL || 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'}
                                alt={book.title}
                                fill
                                unoptimized={Boolean(book.coverURL?.startsWith('data:'))}
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </div>

                        {/* Mic Control Button floating on book cover */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                            <button
                                type="button"
                                onClick={handleMicClick}
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all duration-300 cursor-pointer ${
                                    isActive
                                        ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse ring-4 ring-red-500/30'
                                        : 'bg-amber-800 hover:bg-amber-900 text-white dark:bg-amber-600 dark:hover:bg-amber-500 hover:scale-105'
                                }`}
                                title={isActive ? 'Disconnect Voice Session' : 'Start Voice Conversation'}
                            >
                                <Mic className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Book Details & Voice Status Badges */}
                    <div className="flex-1 text-center md:text-left space-y-4 pt-2 md:pt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                            <div>
                                <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground line-clamp-2">
                                    {book.title}
                                </h1>
                                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                                    By <span className="text-foreground">{book.author}</span>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300 text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs self-center sm:self-start"
                                title="Delete this book"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Book</span>
                            </button>
                        </div>

                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 rounded-xl bg-muted/80 border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs">
                                <span className={`h-2 w-2 rounded-full ${
                                    isActive ? 'bg-emerald-500 animate-ping' : 'bg-muted-foreground/60'
                                }`} />
                                <span>{getStatusLabel(status)}</span>
                            </div>

                            {/* Voice Label */}
                            <div className="flex items-center gap-1.5 rounded-xl bg-muted/80 border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                                <span>Voice: {personaName}</span>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center gap-1.5 rounded-xl bg-muted/80 border border-border/60 px-3 py-1.5 text-xs font-mono font-semibold text-foreground shadow-xs">
                                <span>{formatDuration(duration)} / 15:00</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-card rounded-3xl p-6 shadow-2xl border border-border/80 space-y-5">
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-foreground">Delete Book</h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-foreground">&quot;{book.title}&quot;</span>? This will permanently remove the PDF, all text segments, and vector embeddings.
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium rounded-xl border border-border/80 hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteBook}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete Book</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Limit Error Banner if present */}
            {limitError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-sm font-medium">{limitError}</span>
                    </div>
                    <button onClick={clearErrors} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* SECTION 2: TRANSCRIPT CHAT AREA */}
            <section className="w-full">
                <div className="rounded-3xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden min-h-[460px]">
                    
                    {messages.length === 0 && !currentMessage && !currentUserMessage ? (
                        /* EMPTY TRANSCRIPT STATE */
                        <div className="p-8 my-auto flex flex-col items-center text-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shadow-inner">
                                <Mic className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-foreground">
                                    Start an AI Conversation
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                    Click the mic button above to speak, or type a question about <span className="font-medium text-foreground">&quot;{book.title}&quot;</span> below.
                                </p>
                            </div>

                            {/* Quick Topic Chips */}
                            <div className="pt-4 flex flex-wrap gap-2 justify-center max-w-md">
                                {quickSuggestions.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(prompt)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted/70 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-foreground px-3.5 py-2 rounded-xl border border-border/60 transition-all cursor-pointer shadow-xs"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                                        <span>{prompt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* MESSAGES & TRANSCRIPT LIST */
                        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm md:text-base leading-relaxed shadow-sm ${
                                            msg.role === 'user'
                                                ? 'bg-amber-800 text-white dark:bg-amber-700 font-medium rounded-br-none'
                                                : 'bg-muted/90 text-foreground border border-border/60 font-serif rounded-bl-none'
                                        }`}
                                    >
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {currentUserMessage && (
                                <div className="flex justify-end">
                                    <div className="max-w-[85%] rounded-2xl rounded-br-none bg-amber-800 text-white dark:bg-amber-700 px-5 py-3.5 text-sm md:text-base font-medium shadow-sm">
                                        <p>{currentUserMessage}</p>
                                    </div>
                                </div>
                            )}

                            {currentMessage && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] rounded-2xl rounded-bl-none bg-muted/90 text-foreground border border-border/60 px-5 py-3.5 text-sm md:text-base font-serif flex items-center gap-2 shadow-sm">
                                        <p>{currentMessage}</p>
                                        <span className="h-4 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TEXT INPUT BAR */}
                    <div className="p-4 bg-muted/40 border-t border-border/50 flex items-center gap-3">
                        <div className="flex items-center gap-2.5 flex-1 bg-background border border-border/80 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-amber-700/20 dark:focus-within:ring-amber-400/20 transition-all shadow-inner">
                            <Keyboard className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={`Ask a question about "${book.title}"...`}
                                className="w-full text-sm font-medium bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleSend()}
                            disabled={!textInput.trim()}
                            className="p-3.5 bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md cursor-pointer shrink-0 flex items-center justify-center"
                            title="Send message"
                            aria-label="Send message"
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