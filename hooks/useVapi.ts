import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_VOICE } from "@/lib/constants";
import { askBookQuestion } from "@/lib/actions/book.actions";

/**
 * Union type representing active call state lifecycle.
 */
export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';

/**
 * Utility hook keeping a mutable ref synced with state to avoid stale closures inside event listeners.
 */
const useLatestRef = <T>(value: T) => {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref;
};

/**
 * Custom hook providing real-time AI Voice Assistant functionality for a given Book.
 * Integrates Web Speech Recognition for voice input, RAG query execution for document context,
 * and browser Speech Synthesis for voice response playback.
 * 
 * @param {IBook} book Active book object context
 * @returns Object containing state (status, messages, duration) and actions (start, stop, sendMessage)
 */
export const useVapi = (book: IBook) => {

    const { userId } = useAuth();

    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timeRef = useRef<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<any>(null);
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

    // Speech Synthesis helper to play voice audio through device speakers
    const speakText = useCallback((text: string, onEnd?: () => void) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const cleanSpeechText = text
                .replace(/\*\*/g, '')
                .replace(/•/g, '')
                .replace(/#/g, '')
                .replace(/`/g, '');

            const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onend = () => {
                if (onEnd) onEnd();
            };

            utterance.onerror = (e) => {
                console.error("Speech synthesis error:", e);
                if (onEnd) onEnd();
            };

            window.speechSynthesis.speak(utterance);
        } else {
            if (onEnd) onEnd();
        }
    }, []);

    // Stop speaking audio
    const stopAudio = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    // Speech Recognition helper to listen to user microphone
    const startListeningMic = useCallback(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                try {
                    if (recognitionRef.current) {
                        recognitionRef.current.stop();
                    }

                    const rec = new SpeechRecognition();
                    rec.continuous = false;
                    rec.interimResults = true;
                    rec.lang = 'en-US';

                    rec.onresult = (event: any) => {
                        let transcript = '';
                        for (let i = event.resultIndex; i < event.results.length; ++i) {
                            transcript += event.results[i][0].transcript;
                        }
                        setCurrentUserMessage(transcript);

                        if (event.results[0]?.isFinal) {
                            const finalTranscript = transcript;
                            setCurrentUserMessage('');
                            rec.stop();
                            if (finalTranscript.trim()) {
                                sendMessage(finalTranscript);
                            }
                        }
                    };

                    rec.onerror = (event: any) => {
                        if (event.error !== 'no-speech' && event.error !== 'aborted') {
                            console.warn("Speech recognition notice:", event.error);
                        }
                    };

                    rec.start();
                    recognitionRef.current = rec;
                } catch (e) {
                    console.error("Error starting speech recognition:", e);
                }
            }
        }
    }, []);

    const stopListeningMic = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {}
            recognitionRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            stopTimer();
            stopAudio();
            stopListeningMic();
        };
    }, [stopTimer, stopAudio, stopListeningMic]);

    const start = async () => {
        try {
            setLimitError(null);
            setStatus('connecting');

            setTimeout(() => {
                setStatus('starting');
                setTimeout(() => {
                    setStatus('listening');
                    startTimer();
                    startListeningMic();

                    if (messages.length === 0) {
                        const welcomeText = `Hello! I am your AI assistant for "${bookRef.current?.title || 'this book'}" by ${bookRef.current?.author || 'the author'}. What would you like to discuss today?`;
                        const welcomeMsg: Messages = {
                            role: 'assistant',
                            content: welcomeText,
                        };
                        setMessages([welcomeMsg]);
                        speakText(welcomeText);
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
        stopAudio();
        stopListeningMic();
        setStatus('idle');
        setCurrentMessage('');
        setCurrentUserMessage('');
    };

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setLimitError(null);
        stopAudio();
        stopListeningMic();

        if (status === 'idle') {
            startTimer();
        }

        const userMsg: Messages = {
            role: 'user',
            content: trimmed,
        };

        setMessages((prev) => [...prev, userMsg]);
        setStatus('thinking');

        try {
            const response = await askBookQuestion(bookRef.current._id, trimmed, messages);
            const replyText = response?.answer || `Based on "${bookRef.current?.title}": Here is key information regarding your question.`;

            setStatus('speaking');
            setCurrentMessage(replyText);

            // Speak response out loud through browser speakers
            speakText(replyText, () => {
                const assistantMsg: Messages = {
                    role: 'assistant',
                    content: replyText,
                };
                setMessages((prev) => [...prev, assistantMsg]);
                setCurrentMessage('');
                setStatus('listening');
                startListeningMic();
            });

        } catch (error) {
            console.error("Error asking book question:", error);
            setStatus('listening');
            startListeningMic();
        }
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