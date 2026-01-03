import { useEffect, useMemo, useRef, useState } from 'react';

type AutoSizerProps = {
  children: (size: { width: number; height: number }) => React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

export const AutoSizer = ({ children, ...divProps }: AutoSizerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const elementObserver = useMemo(() => {
    return new ResizeObserver(() => {
      if (!ref.current) return;
      setDimensions({
        height: ref.current.clientHeight,
        width: ref.current.clientWidth,
      });
    });
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    elementObserver.observe(element);

    return () => {
      elementObserver.unobserve(element);
    };
  }, [elementObserver]);

  return (
    <div
      {...divProps}
      style={{ width: '100%', height: '100%', ...divProps.style }}
      ref={ref}
    >
      {children(dimensions)}
    </div>
  );
};
