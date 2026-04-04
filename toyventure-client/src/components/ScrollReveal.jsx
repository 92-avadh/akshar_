import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ as: Component = "div", className = "", delay = 0, children, ...props }) => {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || visible) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Lowered slightly
        rootMargin: "50px 0px 0px 0px", // Triggers 50px BEFORE it enters the screen
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Component
      ref={elementRef}
      className={`reveal-section ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;