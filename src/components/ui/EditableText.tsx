import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Input } from './Input';
import { cn } from '../../lib/utils';

export interface EditableTextProps {
  initialValue: string;
  onSave: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export const EditableText = ({ initialValue, onSave, className, placeholder }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // Sync with external changes if not editing
  useEffect(() => {
    if (!isEditing) {
        setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const handleSave = () => {
    if (value.trim() && value.trim() !== initialValue) {
      onSave(value.trim());
    } else {
      setValue(initialValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn("h-7 px-2 py-1 text-sm font-normal", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className={cn("group/edit flex items-center gap-2", className)}>
      <span className="truncate">{initialValue}</span>
      <button 
        onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card clicks
            setIsEditing(true);
        }}
        className="opacity-0 group-hover/edit:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-opacity"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
};
