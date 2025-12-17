"use client";

import { useState, useRef, useEffect } from "react";
import "./ImageGallery.css";

type Props = {
  images: string[];
};

export default function ImageGallery({ images }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Device detect */
  const isTouchDevice =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* Desktop hover zoom */
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  /* Mobile zoom + pan */
  const MAX_ZOOM = 6;
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const lastDistance = useRef<number | null>(null);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  /* ---------------- Helpers ---------------- */
  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setZoom(false);
    lastDistance.current = null;
    lastTouch.current = null;
  };

  const nextImage = () => {
    setActiveIndex((p) => (p === images.length - 1 ? 0 : p + 1));
    resetZoom();
  };

  const prevImage = () => {
    setActiveIndex((p) => (p === 0 ? images.length - 1 : p - 1));
    resetZoom();
  };

  /* ---------------- Desktop hover zoom ---------------- */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;

    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  /* ---------------- Mobile helpers ---------------- */
  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /* ---------------- Touch move ---------------- */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    /* Allow normal scroll when not zoomed */
    if (scale === 1 && e.touches.length === 1) return;

    e.preventDefault();

    /* Pinch zoom */
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches);

      if (!lastDistance.current) {
        lastDistance.current = distance;
        return;
      }

      let newScale = scale + (distance - lastDistance.current) / 120;
      newScale = Math.min(Math.max(newScale, 1), MAX_ZOOM);

      setScale(newScale);
      lastDistance.current = distance;
      return;
    }

    /* Pan */
    if (e.touches.length === 1 && scale > 1) {
      const touch = e.touches[0];

      if (!lastTouch.current) {
        lastTouch.current = { x: touch.clientX, y: touch.clientY };
        return;
      }

      const dx = touch.clientX - lastTouch.current.x;
      const dy = touch.clientY - lastTouch.current.y;

      setTranslate((prev) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return prev;

        const maxX = ((scale - 1) * rect.width) / 2;
        const maxY = ((scale - 1) * rect.height) / 2;

        return {
          x: Math.max(Math.min(prev.x + dx, maxX), -maxX),
          y: Math.max(Math.min(prev.y + dy, maxY), -maxY),
        };
      });

      lastTouch.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = null;
    lastTouch.current = null;
    if (scale < 1.05) resetZoom();
  };

  /* ---------------- Tap to zoom (mobile) ---------------- */
  const handleTap = () => {
    if (!isTouchDevice) return;

    if (scale === 1) {
      setScale(2.5);
    } else {
      resetZoom();
    }
  };

  return (
    <div className="gallery-container">
      <div
        ref={wrapperRef}
        className="main-image-wrapper"
        onMouseEnter={() => !isTouchDevice && setZoom(true)}
        onMouseLeave={() => !isTouchDevice && setZoom(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="image-container">
          <button className="nav-btn left" onClick={prevImage}>❮</button>

          <img
            ref={imageRef}
            src={images[activeIndex]}
            alt="product"
            draggable={false}
            onClick={handleTap}
            className={`main-image ${scale > 1 ? "zoomed" : ""}`}
            style={{
              transform: isTouchDevice
                ? `translate(${translate.x}px, ${translate.y}px) scale(${scale})`
                : zoom
                ? `scale(3)`
                : "scale(1)",
              transformOrigin: isTouchDevice
                ? "center"
                : `${position.x}% ${position.y}%`,
            }}
          />

          <button className="nav-btn right" onClick={nextImage}>❯</button>
        </div>
      </div>

      <div className="thumb-row">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`thumb ${i === activeIndex ? "active" : ""}`}
            onClick={() => {
              setActiveIndex(i);
              resetZoom();
            }}
          />
        ))}
      </div>
    </div>
  );
}
