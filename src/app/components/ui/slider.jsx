"use client"
import { useState, useRef, useEffect } from "react";

export function CardSliderTest() {
  const cards = [
    { id: 1, text: "Card 1" },
    { id: 2, text: "Card 2" },
    { id: 3, text: "Card 3" },
    { id: 4, text: "Card 4" },
  ];

  return (
    <div className="w-full p-3">
      <CardSlider cards={cards} />
    </div>
  );
}

export default function CardSlider({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const isDragging = useRef(false);

  const GAP = 16; // spazio tra le card (px)

  // Calcola la larghezza dinamica delle card tenendo conto del gap
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setCardWidth(width - GAP); // card = container - gap
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

  const touchStart = (e) => {
    isDragging.current = true;
    startX.current = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    sliderRef.current.style.transition = "none";
  };

  const touchMove = (e) => {
    if (!isDragging.current) return;
    const currentPosition = e.type.includes("mouse")
      ? e.pageX
      : e.touches[0].clientX;
    currentTranslate.current =
      prevTranslate.current + currentPosition - startX.current;
    sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const touchEnd = () => {
    isDragging.current = false;
    const movedBy = currentTranslate.current - prevTranslate.current;

    if (movedBy < -cardWidth / 4 && currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (movedBy > cardWidth / 4 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    const newTranslate = -currentIndex * (cardWidth + GAP);
    sliderRef.current.style.transition = "transform 0.3s ease";
    sliderRef.current.style.transform = `translateX(${newTranslate}px)`;
    prevTranslate.current = newTranslate;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className="overflow-hidden w-full"
        onMouseDown={touchStart}
        onMouseMove={touchMove}
        onMouseUp={touchEnd}
        onMouseLeave={touchEnd}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
        <div
          ref={sliderRef}
          className="flex gap-4" // <-- aggiunto gap tra le card
          style={{
            transform: `translateX(${-currentIndex * (cardWidth + GAP)}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0 h-[180px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-lg text-xl font-bold"
              style={{ minWidth: cardWidth }}
            >
              {card.text}
            </div>
          ))}
        </div>
      </div>

      {/* Pallini */}
      <div className="flex mt-4 gap-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex
                ? "bg-background-inverse"
                : "bg-border-card"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
