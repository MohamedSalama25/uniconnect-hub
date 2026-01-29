"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import faqsData from '@/lib/assistant/faqs.json';
import definitionsData from '@/lib/assistant/definitions.json';
import servicesData from '@/lib/assistant/services.json';
import { playVoice } from '@/lib/assistant/voiceService';

type LocaleType = 'ar' | 'en';

export const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentText, setCurrentText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [view, setView] = useState<'main' | 'services'>('main');
    // Keeping data structure for future support but hardcoding 'ar' as requested
    const [locale] = useState<LocaleType>('ar');

    const isRTL = locale === 'ar';
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const faqs = (faqsData as any)[locale] || faqsData.ar;
    const definitions = (definitionsData as any)[locale] || definitionsData.ar;
    const servicesQuestions = (servicesData as any)[locale] || servicesData.ar;

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, [messages, currentText]);

    useEffect(() => {
        if (!isOpen) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
            stopTyping();
            setIsSpeaking(false);
        }
    }, [isOpen]);

    const stopTyping = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
    };

    const handleFAQClick = async (question: string, answer: string) => {
        if (isTyping) return;
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsTyping(true);
        setIsSpeaking(true);
        setCurrentText("");

        const audio = await playVoice(answer, locale);
        audioRef.current = audio;

        let charDelay = 50;
        if (audio) {
            await new Promise((resolve) => {
                if (audio.duration) resolve(true);
                audio.onloadedmetadata = () => resolve(true);
                setTimeout(() => resolve(false), 1000); // Fallback timeout
            });
            if (audio.duration && audio.duration !== Infinity) {
                charDelay = (audio.duration * 1000) / answer.length;
            }
            audio.onended = () => setIsSpeaking(false);
        } else {
            // If fallback to browser TTS or error
            setTimeout(() => setIsSpeaking(false), answer.length * 100);
        }

        let i = 0;
        stopTyping();
        typingIntervalRef.current = setInterval(() => {
            if (i < answer.length) {
                setCurrentText(prev => prev + answer.charAt(i));
                i++;
            } else {
                stopTyping();
                setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
                setCurrentText("");
                setIsTyping(false);
                if (!audio) setIsSpeaking(false);
            }
        }, charDelay);
    };

    // Stars positions and animations
    const stars = [
        { top: '-10%', left: '10%', size: 16, delay: 0 },
        { top: '20%', left: '-15%', size: 12, delay: 0.5 },
        { top: '70%', left: '-10%', size: 14, delay: 1 },
        { top: '-5%', left: '80%', size: 10, delay: 1.5 },
        { top: '80%', left: '90%', size: 12, delay: 2 },
    ];

    return (
        <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 pointer-events-none`}>
            {/* Floating Avatar Button Area */}
            <div className="relative">
                {/* Animated Stars */}
                {!isOpen && stars.map((star, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute pointer-events-none text-yellow-400 fill-yellow-400"
                        style={{ top: star.top, left: star.left }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.2, 0.8],
                            opacity: [0, 1, 0.5],
                            y: [0, -10, 0],
                            rotate: [0, 45, -45, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut"
                        }}
                    >
                        <Star size={star.size} />
                    </motion.div>
                ))}

                {/* Floating Avatar Button */}
                <motion.div
                    className={`pointer-events-auto ${isOpen ? 'pointer-events-none' : ''}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#1de9b6] text-white shadow-[0_0_40px_rgba(29,233,182,0.6)] overflow-visible group border-4 border-white/20"
                    >
                        <motion.div
                            className="absolute inset-0 bg-[#1de9b6]/40 rounded-full"
                            animate={{
                                scale: isSpeaking ? [1, 2, 1] : [1, 1.5, 1],
                                opacity: isSpeaking ? [0.8, 0, 0.8] : [0.5, 0, 0.5],
                            }}
                            transition={{ duration: isSpeaking ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="relative z-10">
                            <Bot size={42} className={`${isSpeaking ? 'animate-bounce' : ''}`} />
                        </div>
                    </button>
                </motion.div>
            </div>

            {/* Assistant Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, x: isRTL ? -30 : 30 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9, x: isRTL ? -30 : 30 }}
                        className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-[calc(100vw-3rem)] sm:w-[440px] pointer-events-auto`}
                    >
                        <Card className="flex flex-col h-[calc(100vh-6rem)] min-h-[600px] max-h-[790px] shadow-2xl border-primary/20 bg-background/85 backdrop-blur-2xl overflow-hidden rounded-[2.5rem] border-2">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 bg-[#1de9b6] text-white relative overflow-hidden">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                        <Bot size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">{isRTL ? 'مساعد يوني كونكت' : 'UniConnect AI'}</h3>
                                        <div className="flex items-center gap-1.5 opacity-90 text-[11px] uppercase tracking-wider">
                                            <div className={`h-2 w-2 rounded-full ${isSpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                                            {isRTL ? 'مساعدك الذكي دائمًا' : 'Active & Ready'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/10 text-white rounded-2xl">
                                        <X size={22} />
                                    </Button>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-hidden relative">
                                <ScrollArea className="h-full" ref={scrollRef}>
                                    <div className="p-6 space-y-8">
                                        <div className="bg-muted/40 p-5 rounded-[2rem] rounded-tl-none max-w-[90%] text-sm">
                                            {isRTL ? 'أهلاً بك في يوني كونكت هب! كيف يمكنني مساعدتك اليوم؟' : 'Welcome to UniConnect Hub! How can I help you today?'}
                                        </div>
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`p-5 rounded-[2rem] text-sm max-w-[90%] ${msg.role === 'user' ? 'bg-[#1de9b6] text-white rounded-tr-none' : 'bg-muted/50 rounded-tl-none border border-primary/5'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted/80 p-5 rounded-[2rem] rounded-tl-none max-w-[90%] text-sm border-2 border-[#1de9b6]/20">
                                                    {currentText}
                                                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="inline-block w-2 h-4 bg-[#1de9b6] ml-2 align-middle rounded-full" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Suggestions Area */}
                            <div className="px-6 pb-6 space-y-4">
                                <div className="h-px bg-primary/20" />
                                <div className="space-y-5">
                                    {view === 'main' ? (
                                        <>
                                            <div>
                                                <p className="text-[11px] uppercase font-bold mb-3 text-primary/60">{isRTL ? 'تعرف علينا' : 'Discover UniConnect'}</p>
                                                <div className="flex flex-wrap gap-2.5">
                                                    <button onClick={() => setView('services')} disabled={isTyping} className="text-xs px-5 py-2.5 rounded-2xl bg-[#1de9b6] text-white font-bold flex items-center gap-2"><Sparkles size={14} className="animate-pulse" />{isRTL ? 'خدماتنا' : 'Our Services'}</button>
                                                    {definitions.map((def: any) => (
                                                        <button key={def.id} onClick={() => handleFAQClick(def.title, def.content)} disabled={isTyping} className="text-xs px-5 py-2.5 rounded-2xl bg-[#1de9b6]/10 border border-[#1de9b6]/20 hover:bg-[#1de9b6]/20 font-medium text-[#1de9b6]">{def.title}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase font-bold mb-3 text-muted-foreground/60">{isRTL ? 'الأسئلة الشائعة' : 'FAQs'}</p>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {faqs.map((faq: any) => (
                                                        <button key={faq.id} onClick={() => handleFAQClick(faq.question, faq.answer)} disabled={isTyping} className="text-xs px-5 py-2.5 rounded-2xl bg-muted/60 hover:bg-muted italic">{faq.question}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[11px] uppercase font-bold text-[#1de9b6]">{isRTL ? 'خدمات يوني كونكت' : 'UniConnect Services'}</p>
                                                <button onClick={() => setView('main')} className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary"><ArrowLeft size={14} className={isRTL ? 'rotate-180' : ''} />{isRTL ? 'عودة' : 'Back'}</button>
                                            </div>
                                            <ScrollArea className="h-[180px]">
                                                <div className="flex flex-wrap gap-2.5">
                                                    {servicesQuestions.map((qa: any, idx: number) => (
                                                        <button key={idx} onClick={() => handleFAQClick(qa.question, qa.answer)} disabled={isTyping} className="text-start text-xs px-5 py-2.5 rounded-2xl bg-[#1de9b6]/5 border border-[#1de9b6]/10 hover:bg-[#1de9b6]/10 text-primary">{qa.question}</button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
