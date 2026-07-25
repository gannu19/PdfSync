import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_VOICE } from "@/lib/constants";

export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';

const useLatestRef = <T>(value: T) => {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
};

export const useVapi = (book: IBook) => {
    const { userId } = useAuth();

    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timeRef = useRef<NodeJS.Timeout | null>(null);
    const bookRef = useLatestRef(book);

    const isActive = status === 'listening' || status === 'thinking' || status === 'speaking' || status === 'starting';

    const startTimer = useCallback(() => {
        if (timeRef.current) clearInterval(timeRef.current);
        timeRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            stopTimer();
        };
    }, [stopTimer]);

    const start = async () => {
        try {
            setLimitError(null);
            setStatus('connecting');

            setTimeout(() => {
                setStatus('starting');
                setTimeout(() => {
                    setStatus('listening');
                    startTimer();

                    if (messages.length === 0) {
                        const welcomeMsg: Messages = {
                            role: 'assistant',
                            content: `Hello! I am your AI assistant for "${bookRef.current?.title || 'this book'}" by ${bookRef.current?.author || 'the author'}. What would you like to discuss today?`
                        };
                        setMessages([welcomeMsg]);
                    }
                }, 800);
            }, 600);
        } catch (err) {
            console.error("Error starting Vapi session:", err);
            setLimitError("Failed to start voice session. Please try again.");
            setStatus('idle');
        }
    };

    const stop = async () => {
        stopTimer();
        setStatus('idle');
        setCurrentMessage('');
        setCurrentUserMessage('');
    };

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setLimitError(null);

        if (status === 'idle') {
            startTimer();
        }

        const userMsg: Messages = {
            role: 'user',
            content: trimmed,
        };

        setMessages((prev) => [...prev, userMsg]);
        setStatus('thinking');

        setTimeout(() => {
            let replyText = `Based on "${bookRef.current?.title || 'the book'}" by ${bookRef.current?.author || 'the author'}: `;
            if (trimmed.toLowerCase().includes('summary') || trimmed.toLowerCase().includes('summarize')) {
                replyText += `"${bookRef.current?.title || 'This book'}" provides core concepts, strategic insights, and structured takeaways for deep comprehension.`;
            } else if (trimmed.toLowerCase().includes('who') || trimmed.toLowerCase().includes('author')) {
                replyText += `${bookRef.current?.author || 'The author'} is a renowned writer offering practical frameworks in this field.`;
            } else {
                replyText += `Here are key takeaways regarding "${trimmed}". Feel free to ask more details!`;
            }

            setStatus('speaking');
            setCurrentMessage(replyText);

            setTimeout(() => {
                const assistantMsg: Messages = {
                    role: 'assistant',
                    content: replyText,
                };
                setMessages((prev) => [...prev, assistantMsg]);
                setCurrentMessage('');
                setStatus('listening');
            }, 1000);
        }, 1200);
    };

    const clearErrors = async () => {
        setLimitError(null);
    };

    return {
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
    };
};

export default useVapi;