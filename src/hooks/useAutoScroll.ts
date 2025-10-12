import { useEffect, useRef, useState } from "react";

export function useAutoScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [preventAutoScroll, setPreventAutoScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
      setPreventAutoScroll(!isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (!preventAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return { scrollRef, scrollToBottom };
}
