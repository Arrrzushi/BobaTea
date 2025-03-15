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

    // Draw cup body (more bubble-like and cute)
    ctx.beginPath();
    ctx.moveTo(60, 50);
    ctx.bezierCurveTo(50, 50, 40, 80, 40, 120);
    ctx.lineTo(40, 240);
    ctx.bezierCurveTo(40, 270, 160, 270, 160, 240);
    ctx.lineTo(160, 120);
    ctx.bezierCurveTo(160, 80, 150, 50, 140, 50);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add cute cup shine
    ctx.beginPath();
    ctx.moveTo(55, 80);
    ctx.quadraticCurveTo(65, 150, 55, 220);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw tea with better gradient fill
    const teaHeight = 190;
    const teaTop = 70;

    // Create gradient for tea
    const gradient = ctx.createLinearGradient(45, teaTop, 45, teaTop + teaHeight);

    if (secondaryBase) {
      // Mix two flavors with a smooth gradient
      gradient.addColorStop(0, base.color);
      gradient.addColorStop(0.4, base.color);
      gradient.addColorStop(0.6, secondaryBase.color);
    } else {
      gradient.addColorStop(0, base.color);
    }

    // Add milk gradient based on ice level
    const milkOpacity = 0.4 + (iceLevel / 100) * 0.4;
    gradient.addColorStop(1, `rgba(255, 255, 255, ${milkOpacity})`);

    // Fill tea with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(45, teaTop, 110, teaHeight);

    // Draw ice cubes with better shine
    if (iceLevel > 0) {
      const numIceCubes = Math.floor(iceLevel / 10);
      for (let i = 0; i < numIceCubes; i++) {
        const x = 55 + Math.random() * 90;
        const y = 90 + Math.random() * 100;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI / 4);

        // Ice cube with better shine
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(-8, -8, 16, 16);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeRect(-8, -8, 16, 16);

        // Add sparkle
        ctx.beginPath();
        ctx.moveTo(-6, -6);
        ctx.lineTo(-2, -2);
        ctx.moveTo(-4, -4);
        ctx.lineTo(-4, -8);
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }
    }

    // Draw boba pearls with better shine
    toppings.forEach((toppingId) => {
      const topping = TOPPINGS.find(t => t.id === toppingId);
      if (!topping) return;

      for (let i = 0; i < 12; i++) {
        const x = 55 + Math.random() * 90;
        const y = 220 + Math.random() * 35;

        // Draw pearl with gradient
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        const pearlGradient = ctx.createRadialGradient(
          x - 2, y - 2, 1,
          x, y, 7
        );
        pearlGradient.addColorStop(0, "rgba(255,255,255,0.6)");
        pearlGradient.addColorStop(1, topping.color);
        ctx.fillStyle = pearlGradient;
        ctx.fill();

        // Add shine to pearl
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      }
    });

    // Draw kawaii face (cuter version)
    const centerX = 100;
    const centerY = 140;

    // Eyes based on emotion (bigger and cuter)
    ctx.fillStyle = "#000";
    if (emotion === 'excited') {
      // Excited eyes (^ω^)
      ctx.beginPath();
      ctx.moveTo(centerX - 25, centerY - 5);
      ctx.quadraticCurveTo(centerX - 15, centerY - 20, centerX - 5, centerY - 5);
      ctx.moveTo(centerX + 25, centerY - 5);
      ctx.quadraticCurveTo(centerX + 15, centerY - 20, centerX + 5, centerY - 5);
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add cute sparkles
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 15, 2, 0, Math.PI * 2);
      ctx.arc(centerX + 30, centerY - 15, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (emotion === 'relaxed') {
      // Relaxed eyes (｡◕‿◕｡)
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 5, 5, 0, Math.PI * 2);
      ctx.arc(centerX + 15, centerY - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 7, 2, 0, Math.PI * 2);
      ctx.arc(centerX + 15, centerY - 7, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Happy eyes (◕‿◕)
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 5, 8, 0, Math.PI * 2);
      ctx.arc(centerX + 15, centerY - 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(centerX - 13, centerY - 7, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 17, centerY - 7, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rosy cheeks (more visible)
    ctx.fillStyle = "rgba(255, 182, 193, 0.6)";
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY + 10, 10, 0, Math.PI * 2);
    ctx.arc(centerX + 30, centerY + 10, 10, 0, Math.PI * 2);
    ctx.fill();

    // Mouth based on emotion (cuter)
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    if (emotion === 'excited') {
      // Big happy mouth (◠‿◠)
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY + 10);
      ctx.quadraticCurveTo(centerX, centerY + 25, centerX + 20, centerY + 10);
      ctx.stroke();

      // Add cute tongue
      ctx.beginPath();
      ctx.moveTo(centerX - 5, centerY + 15);
      ctx.quadraticCurveTo(centerX, centerY + 20, centerX + 5, centerY + 15);
      ctx.strokeStyle = "#FF9999";
      ctx.stroke();
    } else if (emotion === 'relaxed') {
      // Gentle smile (˘︶˘)
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY + 10);
      ctx.quadraticCurveTo(centerX, centerY + 15, centerX + 15, centerY + 10);
      ctx.stroke();
    } else {
      // Sweet smile (◡‿◡)
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY + 10);
      ctx.quadraticCurveTo(centerX, centerY + 20, centerX + 15, centerY + 10);
      ctx.stroke();
    }

    // Draw lid and straw if ordered
    if (isOrdered) {
      // Cute domed lid
      ctx.beginPath();
      ctx.moveTo(40, 50);
      ctx.bezierCurveTo(40, 35, 100, 25, 160, 50);
      ctx.bezierCurveTo(160, 65, 40, 65, 40, 50);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Kawaii straw with heart pattern
      ctx.beginPath();
      ctx.moveTo(95, 30);
      ctx.lineTo(95, 150);
      ctx.lineTo(105, 150);
      ctx.lineTo(105, 30);
      ctx.fillStyle = "#FF97A1";
      ctx.fill();
      ctx.strokeStyle = "#FF6B81";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add cute heart on straw
      ctx.beginPath();
      ctx.moveTo(100, 60);
      ctx.bezierCurveTo(95, 55, 90, 65, 100, 70);
      ctx.bezierCurveTo(110, 65, 105, 55, 100, 60);
      ctx.fillStyle = "#FF6B81";
      ctx.fill();
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