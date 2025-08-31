"use client";
import { useState, useRef, useEffect } from "react";
import { Card } from "./card";

export function CardSliderTest() {
  const cards = [
    { id: 1, text: "Card 1" },
    { id: 2, text: "Card 2" },
    { id: 3, text: "Card 3" },
    { id: 4, text: "Card 4" },
  ];
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(containerRef.current.offsetWidth)
  },[containerRef])

  return (
    <Slider cards={cards} containerRef={containerRef}>
      {cards.map((card) => (
        <CardTest key={card.id} card={card} cardWidth={width} />
      ))}
    </Slider>
  );
}

export default function Slider({ cards, containerRef, children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  // const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // refs per gestione drag
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const isDragging = useRef(false);

  /**
   * Calcola la larghezza della card = larghezza contenitore
   */
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setCardWidth(width);
        prevTranslate.current = -currentIndex * width;
        if (sliderRef.current) {
          sliderRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  /** drag start */
  const handleStart = (e) => {
    isDragging.current = true;
    startX.current = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    sliderRef.current.style.transition = "none";
  };

  /** drag move */
  const handleMove = (e) => {
    if (!isDragging.current) return;
    const currentPosition = e.type.includes("mouse")
      ? e.pageX
      : e.touches[0].clientX;
    currentTranslate.current =
      prevTranslate.current + currentPosition - startX.current;
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  /** drag end */
  const handleEnd = () => {
    isDragging.current = false;
    const movedBy = currentTranslate.current - prevTranslate.current;

    // swipe a destra / sinistra
    if (movedBy < -cardWidth / 4 && currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (movedBy > cardWidth / 4 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    const newTranslate = -currentIndex * cardWidth;
    sliderRef.current.style.transition = "transform 0.3s ease";
    sliderRef.current.style.transform = `translateX(${newTranslate}px)`;
    prevTranslate.current = newTranslate;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Contenitore visibile */}
      <div
        ref={containerRef}
        className="overflow-hidden w-full"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex"
          style={{
            transform: `translateX(${-currentIndex * cardWidth}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          {children}
        </div>
      </div>

      <DotsSlider length={cards.length} currentIndex={currentIndex} />
    </div>
  );
}

function DotsSlider({ length, currentIndex }) {
  return (
    <>
      {/* Indicatori (pallini) */}
      <div className="flex mt-1 gap-2">
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition ${
              index === currentIndex
                ? "bg-background-inverse"
                : "bg-border-card"
            }`}
          />
        ))}
      </div>
    </>
  );
}

/**
 * Card singola
 * - larghezza = cardWidth (per restare centrata nello slider)
 * - padding applicato all'interno (non fuori)
 */
function CardTest({ card, cardWidth }) {
  return (
    <div className="flex-shrink-0  h-[180px] p-2" style={{ width: cardWidth }}>
      {/* contenuto della card */}
      <Card className={"h-full"}>{card.text}</Card>
    </div>
  );
}
