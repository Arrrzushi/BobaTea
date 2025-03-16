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
  const [bobaPositions, setBobaPositions] = useState<Array<{ x: number; y: number; phase: number }>>([]);

  useEffect(() => {
    // Update emotion based on sweetness and ice level
    if (sweetness > 75 || iceLevel > 75) {
      setEmotion('excited');
    } else if (sweetness < 25 || iceLevel < 25) {
      setEmotion('relaxed');
    } else {
      setEmotion('happy');
    }

    // Initialize boba positions
    const newBobaPositions = Array(10).fill(0).map(() => ({
      x: 55 + Math.random() * 90,
      y: 220 + Math.random() * 35,
      phase: Math.random() * Math.PI * 2
    }));
    setBobaPositions(newBobaPositions);
  }, [sweetness, iceLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      time += 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw straw first if ordered (behind the cup)
      if (isOrdered) {
        ctx.beginPath();
        ctx.moveTo(95, 10);
        ctx.lineTo(95, 200);
        ctx.lineTo(105, 200);
        ctx.lineTo(105, 10);
        ctx.fillStyle = "#FF97A1";
        ctx.fill();
        ctx.strokeStyle = "#FF6B81";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw rounder cup body
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.bezierCurveTo(50, 45, 150, 45, 150, 50);
      ctx.bezierCurveTo(160, 100, 160, 200, 150, 250);
      ctx.bezierCurveTo(150, 260, 50, 260, 50, 250);
      ctx.bezierCurveTo(40, 200, 40, 100, 50, 50);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add cup shine
      ctx.beginPath();
      ctx.moveTo(60, 70);
      ctx.quadraticCurveTo(70, 150, 60, 230);
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw tea with gradient fill
      const teaTop = 60;
      const teaHeight = 180;
      const teaGradient = ctx.createLinearGradient(50, teaTop, 50, teaTop + teaHeight);

      if (secondaryBase) {
        teaGradient.addColorStop(0, base.color);
        teaGradient.addColorStop(0.4, base.color);
        teaGradient.addColorStop(0.6, secondaryBase.color);
        teaGradient.addColorStop(1, secondaryBase.color);
      } else {
        teaGradient.addColorStop(0, base.color);
        teaGradient.addColorStop(1, base.color);
      }

      ctx.fillStyle = teaGradient;
      ctx.fillRect(50, teaTop, 100, teaHeight);

      // Add milk overlay based on ice level
      const milkGradient = ctx.createLinearGradient(50, teaTop, 50, teaTop + teaHeight);
      milkGradient.addColorStop(0, "transparent");
      milkGradient.addColorStop(1, `rgba(255, 255, 255, ${iceLevel / 100 * 0.8})`);
      ctx.fillStyle = milkGradient;
      ctx.fillRect(50, teaTop, 100, teaHeight);

      // Animated boba pearls
      toppings.forEach((toppingId) => {
        const topping = TOPPINGS.find(t => t.id === toppingId);
        if (!topping) return;

        bobaPositions.forEach((boba) => {
          const floatOffset = Math.sin(time + boba.phase) * 3;

          // Draw boba pearl
          ctx.beginPath();
          ctx.arc(boba.x, boba.y + floatOffset, 8, 0, Math.PI * 2);
          const pearlGradient = ctx.createRadialGradient(
            boba.x - 2, boba.y + floatOffset - 2, 1,
            boba.x, boba.y + floatOffset, 8
          );
          pearlGradient.addColorStop(0, "rgba(255,255,255,0.7)");
          pearlGradient.addColorStop(1, topping.color);
          ctx.fillStyle = pearlGradient;
          ctx.fill();

          // Add shine
          ctx.beginPath();
          ctx.arc(boba.x - 3, boba.y + floatOffset - 3, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fill();
        });
      });

      // Draw kawaii face
      const centerX = 100;
      const centerY = 140;

      // Redesigned kawaii eyes based on emotion
      ctx.fillStyle = "#000"; // Default eye color
      ctx.strokeStyle = "#000"; // Default stroke color
      ctx.lineWidth = 2;

      if (emotion === 'excited') {
        // Excited eyes (☆▽☆)
        ctx.beginPath();
        ctx.arc(centerX - 25, centerY - 5, 10, 0, Math.PI * 2); // Left eye
        ctx.arc(centerX + 25, centerY - 5, 10, 0, Math.PI * 2); // Right eye
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX - 25, centerY - 5, 4, 0, Math.PI * 2); // Left sparkle
        ctx.arc(centerX + 25, centerY - 5, 4, 0, Math.PI * 2); // Right sparkle
        ctx.fillStyle = "#FFD700"; // Sparkle color
        ctx.fill();
        ctx.fillStyle = "#000"; // Reset eye color
      } else if (emotion === 'relaxed') {
        // Relaxed eyes (◕‿◕)
        ctx.beginPath();
        ctx.arc(centerX - 15, centerY - 8, 8, 0, Math.PI, true); // Left eye
        ctx.arc(centerX + 15, centerY - 8, 8, 0, Math.PI, true); // Right eye
        ctx.fill();
      } else {
        // Happy eyes (｡◕‿◕｡)
        ctx.beginPath();
        ctx.arc(centerX - 15, centerY - 5, 10, 0, Math.PI * 2); // Left eye
        ctx.arc(centerX + 15, centerY - 5, 10, 0, Math.PI * 2); // Right eye
        ctx.fill();
      }

      // Eye shine
      ctx.beginPath();
      ctx.arc(centerX - 12, centerY - 8, 4, 0, Math.PI * 2); // Left eye shine
      ctx.arc(centerX + 18, centerY - 8, 4, 0, Math.PI * 2); // Right eye shine
      ctx.fillStyle = "#fff"; // Shine color
      ctx.fill();

      // Rosy cheeks (moved higher, just below the eyes)
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY - 5, 8, 0, Math.PI * 2); // Left cheek
      ctx.arc(centerX + 30, centerY - 5, 8, 0, Math.PI * 2); // Right cheek
      ctx.fillStyle = "rgba(255, 182, 193, 0.7)"; // Blush color
      ctx.fill();

      // Mouth based on emotion
      ctx.beginPath();
      ctx.strokeStyle = "#000"; // Mouth stroke color
      ctx.lineWidth = 2;
      if (emotion === 'excited') {
        // Big happy mouth (∪ω∪)
        ctx.moveTo(centerX - 20, centerY + 15);
        ctx.bezierCurveTo(
          centerX - 10, centerY + 25,
          centerX + 10, centerY + 25,
          centerX + 20, centerY + 15
        );
        ctx.stroke();

        // Add cute fang
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY + 15);
        ctx.lineTo(centerX + 8, centerY + 19);
        ctx.lineTo(centerX + 11, centerY + 15);
        ctx.fillStyle = "#fff"; // Fang color
        ctx.fill();
        ctx.stroke();
      } else if (emotion === 'relaxed') {
        // Sleepy smile (ᴗ.ᴗ)
        ctx.moveTo(centerX - 15, centerY + 15);
        ctx.quadraticCurveTo(centerX, centerY + 18, centerX + 15, centerY + 15);
      } else {
        // Sweet smile (◡‿◡)
        ctx.moveTo(centerX - 15, centerY + 12);
        ctx.quadraticCurveTo(centerX, centerY + 22, centerX + 15, centerY + 12);
      }
      ctx.stroke();

      // Draw lid if ordered
      if (isOrdered) {
        // Domed lid
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.bezierCurveTo(50, 30, 150, 30, 150, 50);
        ctx.bezierCurveTo(150, 70, 50, 70, 50, 50);
        ctx.fillStyle = "#fff"; // Lid color
        ctx.fill();
        ctx.strokeStyle = "#000"; // Lid stroke color
        ctx.lineWidth = 3;
        ctx.stroke();

        // Add heart decoration on straw
        ctx.beginPath();
        ctx.moveTo(100, 40);
        ctx.bezierCurveTo(95, 35, 85, 45, 100, 55);
        ctx.bezierCurveTo(115, 45, 105, 35, 100, 40);
        ctx.fillStyle = "#FF6B81"; // Heart color
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [base, secondaryBase, toppings, sweetness, iceLevel, emotion, isOrdered, bobaPositions]);

  return (
    <motion.div
      className="relative w-full"
      initial={{ y: 0 }}
      animate={{ y: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
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