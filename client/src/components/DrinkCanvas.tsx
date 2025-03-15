import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TEA_BASES, TOPPINGS } from "@/lib/constants";

interface DrinkCanvasProps {
  base: typeof TEA_BASES[0];
  secondaryBase: typeof TEA_BASES[0] | null;
  toppings: string[];
  sweetness: number;
  iceLevel: number;
  isOrdered?: boolean;
}

export function DrinkCanvas({ 
  base, 
  secondaryBase,
  toppings, 
  sweetness, 
  iceLevel,
  isOrdered = false 
}: DrinkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState<'happy' | 'excited' | 'relaxed'>('happy');

  useEffect(() => {
    // Update emotion based on sweetness and ice level
    if (sweetness > 75 || iceLevel > 75) {
      setEmotion('excited');
    } else if (sweetness < 25 || iceLevel < 25) {
      setEmotion('relaxed');
    } else {
      setEmotion('happy');
    }
  }, [sweetness, iceLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cup body (rounder and cuter)
    ctx.beginPath();
    ctx.moveTo(60, 50);
    ctx.bezierCurveTo(50, 50, 40, 80, 40, 100);
    ctx.bezierCurveTo(40, 200, 40, 250, 50, 270);
    ctx.lineTo(150, 270);
    ctx.bezierCurveTo(160, 250, 160, 200, 160, 100);
    ctx.bezierCurveTo(160, 80, 150, 50, 140, 50);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw milk tea gradient
    const teaHeight = 200;
    const gradient = ctx.createLinearGradient(50, 70, 50, 270);

    if (secondaryBase) {
      // Mix two flavors
      gradient.addColorStop(0, base.color);
      gradient.addColorStop(0.5, secondaryBase.color);
    } else {
      gradient.addColorStop(0, base.color);
    }

    // Add milk gradient based on ice level
    const milkOpacity = 0.3 + (iceLevel / 100) * 0.5;
    gradient.addColorStop(1, `rgba(255, 255, 255, ${milkOpacity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(45, 70, 110, teaHeight);

    // Draw ice cubes
    if (iceLevel > 0) {
      const numIceCubes = Math.floor(iceLevel / 10);
      for (let i = 0; i < numIceCubes; i++) {
        const x = 55 + Math.random() * 90;
        const y = 80 + Math.random() * 100;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI);

        // Ice cube with shine
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillRect(-8, -8, 16, 16);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.strokeRect(-8, -8, 16, 16);

        // Add shine
        ctx.beginPath();
        ctx.moveTo(-6, -6);
        ctx.lineTo(-2, -2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.stroke();

        ctx.restore();
      }
    }

    // Draw boba pearls
    toppings.forEach((toppingId) => {
      const topping = TOPPINGS.find(t => t.id === toppingId);
      if (!topping) return;

      for (let i = 0; i < 12; i++) {
        const x = 55 + Math.random() * 90;
        const y = 220 + Math.random() * 40;

        // Draw pearl
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        const pearlGradient = ctx.createRadialGradient(
          x - 2, y - 2, 1,
          x, y, 6
        );
        pearlGradient.addColorStop(0, "rgba(255,255,255,0.4)");
        pearlGradient.addColorStop(1, topping.color);
        ctx.fillStyle = pearlGradient;
        ctx.fill();

        // Add shine
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();
      }
    });

    // Draw kawaii face
    const centerX = 100;
    const centerY = 150;

    // Eyes based on emotion
    ctx.fillStyle = "#000";
    if (emotion === 'excited') {
      // Excited eyes (^_^)
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY - 5);
      ctx.quadraticCurveTo(centerX - 15, centerY - 15, centerX - 10, centerY - 5);
      ctx.moveTo(centerX + 20, centerY - 5);
      ctx.quadraticCurveTo(centerX + 15, centerY - 15, centerX + 10, centerY - 5);
      ctx.stroke();
    } else if (emotion === 'relaxed') {
      // Relaxed eyes (- -)
      ctx.fillRect(centerX - 20, centerY - 5, 10, 2);
      ctx.fillRect(centerX + 10, centerY - 5, 10, 2);
    } else {
      // Happy eyes (• •)
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 5, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 15, centerY - 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cheeks
    ctx.fillStyle = "rgba(255, 192, 203, 0.4)";
    ctx.beginPath();
    ctx.arc(centerX - 25, centerY + 5, 7, 0, Math.PI * 2);
    ctx.arc(centerX + 25, centerY + 5, 7, 0, Math.PI * 2);
    ctx.fill();

    // Mouth based on emotion
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    if (emotion === 'excited') {
      // Big smile
      ctx.arc(centerX, centerY + 5, 12, 0, Math.PI);
    } else if (emotion === 'relaxed') {
      // Small smile
      ctx.arc(centerX, centerY + 5, 8, 0, Math.PI);
    } else {
      // Regular smile
      ctx.arc(centerX, centerY + 5, 10, 0, Math.PI);
    }
    ctx.stroke();

    // Draw lid and straw if ordered
    if (isOrdered) {
      // Lid
      ctx.beginPath();
      ctx.moveTo(40, 50);
      ctx.bezierCurveTo(40, 40, 160, 40, 160, 50);
      ctx.bezierCurveTo(160, 60, 40, 60, 40, 50);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.stroke();

      // Straw
      ctx.beginPath();
      ctx.moveTo(95, 30);
      ctx.lineTo(95, 150);
      ctx.lineTo(105, 150);
      ctx.lineTo(105, 30);
      ctx.fillStyle = "#FF97A1";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.stroke();
    }

  }, [base, secondaryBase, toppings, sweetness, iceLevel, emotion, isOrdered]);

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