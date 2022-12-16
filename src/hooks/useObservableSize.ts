import { useEffect, useState } from "react";

export default function useObservableSize(ref) {
  const [size, setSize] = useState({ width: 1, height: 1 });
  useEffect(() => {
    console.log("useObservableSize", ref);
    if (!ref) return;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        // console.log("contentRect",entry.contentRect)
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });
    resizeObserver.observe(ref.current);
  }, [setSize, ref]);
  return size;
}
