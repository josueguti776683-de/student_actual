/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NumberItem } from "../types";
import {
  getWordEmoji,
  getTwemojiUrl,
  splitEmojiGraphemes,
  getOfflineFallbackEmoji,
} from "../utils/wordEmojis";

interface WordEmojiProps {
  item?: Partial<NumberItem> | string | number | null;
  className?: string;
}

export const WordEmoji: React.FC<WordEmojiProps> = ({ item, className = "" }) => {
  const emojiStr = getWordEmoji(item);
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setFailedIndices({});
  }, [emojiStr]);

  if (!emojiStr) return null;

  const graphemes = splitEmojiGraphemes(emojiStr);
  if (graphemes.length === 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center gap-[0.08em] leading-none select-none ${className}`}
      aria-label={emojiStr}
    >
      {graphemes.map((g, idx) => {
        if (failedIndices[idx]) {
          return (
            <span key={`${g}-${idx}`} className="emoji-font inline-block leading-none">
              {getOfflineFallbackEmoji(g)}
            </span>
          );
        }
        return (
          <img
            key={`${g}-${idx}`}
            src={getTwemojiUrl(g)}
            alt={g}
            draggable={false}
            loading="eager"
            decoding="sync"
            onError={() =>
              setFailedIndices((prev) => ({
                ...prev,
                [idx]: true,
              }))
            }
            className="inline-block w-[1em] h-[1em] object-contain align-middle select-none pointer-events-none"
          />
        );
      })}
    </span>
  );
};

export default WordEmoji;
