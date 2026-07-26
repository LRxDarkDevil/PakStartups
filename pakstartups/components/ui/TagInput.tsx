"use client";

import React, { useState, useRef } from "react";
import { X, Plus, Pin } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  pinnedTags?: string[];
  onTogglePin?: (tag: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function TagInput({
  tags,
  onChange,
  pinnedTags,
  onTogglePin,
  placeholder = "Type and press Enter...",
  ariaLabel,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const items = pastedText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (items.length > 0) {
      const newTags = [...tags];
      for (const item of items) {
        if (!newTags.includes(item)) {
          newTags.push(item);
        }
      }
      onChange(newTags);
      setInputValue("");
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="min-h-[140px] w-full p-3 bg-white border border-[#e0e0e0] rounded-xl focus-within:border-[#0f5238] focus-within:ring-2 focus-within:ring-[#0f5238]/20 transition-all flex flex-wrap content-start gap-2 cursor-text"
    >
      {tags.map((tag, index) => {
        const isPinned = pinnedTags ? pinnedTags.includes(tag) : false;
        return (
          <span
            key={`${tag}-${index}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full animate-fadeIn select-none group transition-all ${
              isPinned
                ? "bg-amber-50 text-amber-900 border border-amber-300/80 shadow-xs"
                : "bg-[#0f5238]/10 text-[#0f5238] border border-[#0f5238]/20 hover:bg-[#0f5238]/15"
            }`}
          >
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(tag);
                }}
                title={isPinned ? "Unpin from Homepage Quick Search" : "Pin to Homepage Quick Search"}
                className={`p-0.5 rounded-full transition-colors ${
                  isPinned
                    ? "text-amber-700 hover:bg-amber-200/60"
                    : "text-[#0f5238]/60 hover:text-[#0f5238] hover:bg-[#0f5238]/20"
                }`}
                aria-label={`Toggle pin for tag ${tag}`}
              >
                <Pin className={`w-3.5 h-3.5 ${isPinned ? "fill-amber-600 rotate-45" : ""}`} />
              </button>
            )}
            <span>{tag}</span>
            {isPinned && (
              <span className="text-[10px] uppercase font-bold tracking-wide text-amber-700 bg-amber-200/50 px-1.5 py-0.2 rounded">
                Pinned
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 text-current transition-colors focus:outline-none ml-0.5"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        );
      })}

      <div className="inline-flex items-center flex-1 min-w-[160px]">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? placeholder : "Add item..."}
          aria-label={ariaLabel}
          className="w-full bg-transparent text-sm text-[#002112] placeholder-[#a0a0a0] focus:outline-none py-1"
        />
        {inputValue.trim() && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addTag(inputValue);
            }}
            className="ml-1 px-2.5 py-1 text-xs font-medium bg-[#0f5238] text-white rounded-lg flex items-center gap-1 hover:bg-[#2d6a4f] transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
}
