import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <div className="p-4 border-t border-border">
            <div className="flex gap-3">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button
                    onClick={handleSend}
                    className="btn-hover"
                    disabled={!message.trim()}
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
