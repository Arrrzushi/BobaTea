import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TEA_BASES, TOPPINGS } from "@/lib/constants";

interface DrinkCanvasProps {
  base: typeof TEA_BASES[0];
  toppings: string[];
  sweetness: number;
  iceLevel: number;
}

export function DrinkCanvas({ base, toppings, sweetness, iceLevel }: DrinkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cup
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(30, 250);
    ctx.lineTo(170, 250);
    ctx.lineTo(150, 50);
    ctx.closePath();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw tea
    ctx.fillStyle = base.color;
    ctx.fillRect(30, 250 - (200 * sweetness/100), 140, 200 * sweetness/100);

    // Draw ice (if any)
    if (iceLevel > 0) {
      for (let i = 0; i < iceLevel/20; i++) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(
          40 + Math.random() * 100,
          70 + Math.random() * 150,
          15,
          15
        );
      }
    }

    // Draw toppings
    toppings.forEach((toppingId, index) => {
      const topping = TOPPINGS.find(t => t.id === toppingId);
      if (!topping) return;

      const y = 230 - (index * 10);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          50 + Math.random() * 100,
          y,
          5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = topping.color;
        ctx.fill();
      }
    });

  }, [base, toppings, sweetness, iceLevel]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width={200}
        height={300}
        className="w-full max-w-[300px] mx-auto"
      />
    </motion.div>
  );
}
