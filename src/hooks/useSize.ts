import { useEffect, useState } from "react";

export default function useSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize(entry?.contentRect ?? { width: 0, height: 0 }),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
