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

    // Draw rounder cup with decorative elements
    ctx.beginPath();
    ctx.moveTo(60, 50);
    // Cup top rim
    ctx.bezierCurveTo(60, 45, 140, 45, 140, 50);
    // Right side
    ctx.bezierCurveTo(150, 100, 155, 200, 150, 250);
    // Bottom curve
    ctx.bezierCurveTo(150, 260, 50, 260, 50, 250);
    // Left side
    ctx.bezierCurveTo(45, 200, 50, 100, 60, 50);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add cup shine
    ctx.beginPath();
    ctx.moveTo(70, 70);
    ctx.bezierCurveTo(75, 100, 80, 150, 75, 200);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.stroke();

    // Calculate milk level based on ice level (more ice = more milk)
    const milkLevel = 200 * (iceLevel / 100);

    // Draw tea gradient
    const gradient = ctx.createLinearGradient(50, 250 - milkLevel, 50, 250);
    gradient.addColorStop(0, base.color);
    gradient.addColorStop(1, "rgba(255,255,255,0.8)");

    // Fill tea
    ctx.fillStyle = gradient;
    ctx.fillRect(50, 250 - milkLevel, 100, milkLevel);

    // Draw ice cubes with transparency
    if (iceLevel > 0) {
      const numIceCubes = Math.floor(iceLevel / 10);
      for (let i = 0; i < numIceCubes; i++) {
        const x = 60 + Math.random() * 80;
        const y = 70 + Math.random() * (milkLevel - 20);

        // Draw a more interesting ice cube shape
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 15, y - 5);
        ctx.lineTo(x + 20, y + 10);
        ctx.lineTo(x + 5, y + 15);
        ctx.closePath();

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.stroke();
      }
    }

    // Draw boba pearls with better styling
    toppings.forEach((toppingId) => {
      const topping = TOPPINGS.find(t => t.id === toppingId);
      if (!topping) return;

      const numPearls = 8;
      for (let i = 0; i < numPearls; i++) {
        const x = 60 + Math.random() * 80;
        const y = 220 + Math.random() * 20;

        // Draw a more appealing boba pearl
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);

        // Add gradient to make pearls look rounder
        const pearlGradient = ctx.createRadialGradient(
          x - 2, y - 2, 1,
          x, y, 6
        );
        pearlGradient.addColorStop(0, "rgba(255,255,255,0.4)");
        pearlGradient.addColorStop(1, topping.color);

        ctx.fillStyle = pearlGradient;
        ctx.fill();

        // Add shine to pearls
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
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
        className="w-full max-w-[300px] mx-auto cursor-pointer"
      />
    </motion.div>
  );
}