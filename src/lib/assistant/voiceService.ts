import axios from 'axios';

// NOTE: Ideally these should be in environment variables
const VOICE_API_KEY = 'sk_897a833bc16636a1622885b28740cf29bb5fc69108a6f9a7';
const VOICE_ID_ADAM = 'pNInz6obpgDQGcFmaJgB';

export async function playVoice(text: string, locale: string = 'ar'): Promise<HTMLAudioElement | null> {
    try {
        const voiceId = VOICE_ID_ADAM;
        const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        const response = await axios.post(
            API_URL,
            {
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': VOICE_API_KEY,
                },
                responseType: 'blob',
            }
        );

        if (response.data) {
            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play().catch(e => console.error("Auto-play failed:", e));
            return audio;
        }
        throw new Error('No audio data');
    } catch (error) {
        console.error('ElevenLabs API error, falling back to browser TTS:', error);
        return speakWithBrowser(text, locale);
    }
}

function speakWithBrowser(text: string, locale: string): Promise<HTMLAudioElement | null> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            resolve(null);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale === 'ar' ? 'ar-SA' : 'en-US';

        // Try to find a good voice for the locale
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(locale));
        if (voice) utterance.voice = voice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
        resolve(null);
    });
}
