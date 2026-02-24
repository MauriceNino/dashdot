"use client"

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useMountedTheme } from '@/hooks/useMountedTheme';

export const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const theme = useMountedTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto relative group mb-16">
      <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
      <div
        className={twMerge(
          'relative rounded-xl p-2 flex items-center gap-4 border',
          theme === 'light'
            ? 'bg-white/80 border-gray-200 shadow-xl'
            : 'bg-[#111] border-white/10 shadow-2xl',
        )}
      >
        <div
          className={twMerge(
            'flex-1 flex items-start gap-3 px-4 py-4 font-mono text-sm overflow-hidden',
            theme === 'light' ? 'text-gray-600' : 'text-gray-400',
          )}
        >
          <span className="text-purple-500">$</span>
          <span className="truncate">{text}</span>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-white text-black font-bold py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
