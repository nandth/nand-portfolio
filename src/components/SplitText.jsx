import { useEffect, useRef, useState } from 'react';

/**
 * Splits children text into individual characters, then animates each in
 * with a staggered translateY + fade transition.
 *
 * Props:
 *   as          – wrapper tag (default 'span')
 *   charDelay   – ms between each character (default 32)
 *   initialDelay – ms before the first character starts (default 0)
 *   triggerOnMount – fire immediately on mount instead of on scroll-entry
 */
export default function SplitText({
  children,
  className = '',
  as: Tag = 'span',
  charDelay = 32,
  initialDelay = 0,
  triggerOnMount = false,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerOnMount) {
      const id = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(id);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerOnMount]);

  const text = typeof children === 'string' ? children : '';

  return (
    <Tag ref={ref} className={`split-text ${className}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`split-char${visible ? ' split-char--on' : ''}`}
          style={{ transitionDelay: `${initialDelay + i * charDelay}ms` }}
        >
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </Tag>
  );
}
