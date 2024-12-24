import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useTheme } from '@/components/theme-provider';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const { theme } = useTheme();

  return (
    <div className="z-50">
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
        theme={theme === 'dark' ? 'dark' : 'light'}
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
}