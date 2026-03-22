import { useEffect, useRef, useState } from 'react';

/**
 * Reveals children with a blur-to-clear + fade + subtle lift animation.
 *
 * Props:
 *   delay         – ms before the reveal starts (applied via CSS var)
 *   triggerOnMount – fire on mount instead of on scroll-entry
 *   as            – wrapper element tag (default 'div')
 */
export default function BlurReveal({
  children,
  className = '',
  delay = 0,
  triggerOnMount = false,
  as: Tag = 'div',
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
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerOnMount]);

  return (
    <Tag
      ref={ref}
      className={`blur-reveal${visible ? ' blur-reveal--on' : ''} ${className}`}
      style={{ '--br-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
