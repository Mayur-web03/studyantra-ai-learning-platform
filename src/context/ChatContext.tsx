import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ChatThread, Message } from '../types/chat';

interface ChatContextType {
    threads: ChatThread[];
    activeThreadId: string | null;
    threadCounter: number;
    createNewChat: () => void;
    addMessage: (message: Message) => void;
    deleteThread: (id: string) => void;
    renameThread: (id: string, newTitle: string) => void;
    setActiveThreadId: (id: string) => void;
    activeThread: ChatThread | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [threads, setThreads] = useState<ChatThread[]>(() => {
        const saved = localStorage.getItem('chat_threads');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
        const savedId = localStorage.getItem('chat_active_thread_id');
        return savedId ? savedId : null;
    });

    const [threadCounter, setThreadCounter] = useState<number>(() => {
        const counter = localStorage.getItem('chat_thread_counter');
        return counter ? parseInt(counter, 10) : 1;
    });

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('chat_threads', JSON.stringify(threads));
    }, [threads]);

    useEffect(() => {
        if (activeThreadId) {
            localStorage.setItem('chat_active_thread_id', activeThreadId);
        } else {
            localStorage.removeItem('chat_active_thread_id');
        }
    }, [activeThreadId]);

    useEffect(() => {
        localStorage.setItem('chat_thread_counter', threadCounter.toString());
    }, [threadCounter]);

    // Initialization: If no threads exist, create an initial blank one
    useEffect(() => {
        if (threads.length === 0) {
            const newId = `thread_${threadCounter}`;
            const newThread: ChatThread = {
                id: newId,
                title: "New Chat",
                messages: [],
                createdAt: Date.now(),
            };
            setThreads([newThread]);
            setActiveThreadId(newId);
        }
    }, [threads.length, threadCounter]);

    const activeThread = threads.find((t) => t.id === activeThreadId);

    const createNewChat = () => {
        // Only allow creating a new chat if the current active chat is NOT empty.
        if (activeThread && activeThread.messages.length === 0) {
            return;
        }

        const nextCounter = threadCounter + 1;
        const newId = `thread_${nextCounter}`;
        const newThread: ChatThread = {
            id: newId,
            title: "New Chat",
            messages: [],
            createdAt: Date.now(),
        };

        setThreads((prev) => [newThread, ...prev]);
        setActiveThreadId(newId);
        setThreadCounter(nextCounter);
    };

    const addMessage = (message: Message) => {
        if (!activeThreadId) return;

        setThreads((prev) =>
            prev.map((thread) => {
                if (thread.id === activeThreadId) {
                    const isFirstUserMessage =
                        thread.messages.length === 0 && message.role === 'user';

                    return {
                        ...thread,
                        messages: [...thread.messages, message],
                        title: isFirstUserMessage
                            ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                            : thread.title,
                    };
                }
                return thread;
            })
        );
    };

    const deleteThread = (id: string) => {
        setThreads((prev) => {
            const filtered = prev.filter((t) => t.id !== id);

            if (activeThreadId === id) {
                setActiveThreadId(filtered.length > 0 ? filtered[0].id : null);
            }
            return filtered;
        });
    };

    const renameThread = (id: string, newTitle: string) => {
        setThreads((prev) =>
            prev.map((thread) =>
                thread.id === id ? { ...thread, title: newTitle } : thread
            )
        );
    };

    const value = {
        threads,
        activeThreadId,
        threadCounter,
        activeThread,
        createNewChat,
        addMessage,
        deleteThread,
        renameThread,
        setActiveThreadId,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
