import { useState } from 'react';
import { emojiSrc } from './emojiSrc';

export const Emoji = ({ v, size }: { v: string; size?: number }) => {
  const [err, setErr] = useState(false);
  return err ? (
    <span className="emoji-fallback" style={size ? { fontSize: size } : undefined}>{v}</span>
  ) : (
    <img
      src={emojiSrc(v)}
      alt={v}
      className="emoji-img"
      style={size ? { width: size, height: size } : undefined}
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
};
