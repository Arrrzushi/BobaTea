import { motion } from "framer-motion";
import { TEA_BASES, TOPPINGS } from "@/lib/constants";

interface BobaTeaProps {
  base: typeof TEA_BASES[0];
  secondaryBase: typeof TEA_BASES[0] | null;
  toppings: string[];
  sweetness: number;
  iceLevel: number;
  isOrdered: boolean;
}

export function BobaTea({
  base,
  secondaryBase,
  toppings,
  sweetness,
  iceLevel,
  isOrdered
}: BobaTeaProps) {
  // Determine emotion based on levels
  const getEmotion = () => {
    if (sweetness > 90 && iceLevel > 90) return "dramatic"; // New dramatic emotion
    if (sweetness > 75 && iceLevel > 75) return "super-excited";
    if (sweetness > 75) return "sweet-happy";
    if (iceLevel > 75) return "ice-happy";
    if (sweetness < 25 || iceLevel < 25) return "sleepy";
    return "happy";
  };
  const emotion = getEmotion();

  return (
    <div className="flex justify-center items-center">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="relative w-40 h-72"
      >
        {/* Straw - Fully Visible Through Lid to the End of Glass */}
        {isOrdered && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-6 h-72 bg-[#FF97A1] rounded-full z-10"></div>
        )}

        {/* Transparent Cup Lid with Straw Hole */}
        {isOrdered && (
          <div className="absolute -top-4 left-0 w-full h-6 bg-white rounded-full border-2 border-gray-300 z-20"></div>
        )}

        {/* Cup with Gradient Tea */}
        <div
          className="absolute w-full h-full rounded-b-full border-4 border-gray-300 shadow-lg overflow-hidden"
          style={{
            background: secondaryBase
              ? `linear-gradient(to bottom, ${base.color} 40%, ${secondaryBase.color})`
              : base.color
          }}
        />

        {/* Kawaii Face */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30">
          {/* Eyes based on emotion */}
          {emotion === "dramatic" ? (
            // Dramatic star eyes (★ω★)
            <div className="flex gap-8">
              <div className="w-4 h-4 text-yellow-400">★</div>
              <div className="w-4 h-4 text-yellow-400">★</div>
            </div>
          ) : emotion === "super-excited" ? (
            // Super excited sparkly eyes (≧▽≦)
            <div className="flex gap-8">
              <div className="w-4 h-4 text-yellow-400">✨</div>
              <div className="w-4 h-4 text-yellow-400">✨</div>
            </div>
          ) : emotion === "sweet-happy" ? (
            // Sweet happy eyes (｡◕‿◕｡)
            <div className="flex gap-8">
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full transform translate-x-[1px] -translate-y-[1px]"></div>
              </div>
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full transform translate-x-[1px] -translate-y-[1px]"></div>
              </div>
            </div>
          ) : emotion === "ice-happy" ? (
            // Ice happy eyes (❄️❄️)
            <div className="flex gap-8">
              <div className="w-4 h-4">❄️</div>
              <div className="w-4 h-4">❄️</div>
            </div>
          ) : emotion === "sleepy" ? (
            // Sleepy eyes (￣ω￣)
            <div className="flex gap-8">
              <div className="w-3 h-px bg-black transform -translate-y-1 rotate-12"></div>
              <div className="w-3 h-px bg-black transform -translate-y-1 -rotate-12"></div>
            </div>
          ) : (
            // Default happy eyes (｡◕‿◕｡)
            <div className="flex gap-8">
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full transform translate-x-[1px] -translate-y-[1px]"></div>
              </div>
              <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full transform translate-x-[1px] -translate-y-[1px]"></div>
              </div>
            </div>
          )}

          {/* Mouth based on emotion */}
          <div className="mt-2">
            {emotion === "dramatic" ? (
              // Dramatic mouth with tongue (＾▽＾)
              <div className="w-8 h-6 flex items-center justify-center">
                <div className="w-6 h-4 border-b-4 border-black rounded-lg"></div>
                <div className="absolute w-2 h-2 bg-pink-400 rounded-full transform translate-y-2"></div>
              </div>
            ) : emotion === "super-excited" ? (
              // Super excited mouth (∪ω∪)
              <div className="w-8 h-6 flex items-center justify-center">
                <div className="w-6 h-4 border-b-4 border-black rounded-lg"></div>
              </div>
            ) : emotion === "sweet-happy" ? (
              // Sweet happy mouth (◡‿◡)
              <div className="w-6 h-4 border-b-2 border-black mx-auto" style={{ borderRadius: "0 0 100% 100%" }}></div>
            ) : emotion === "ice-happy" ? (
              // Ice happy mouth (❄️)
              <div className="w-6 h-3 border-2 border-black mx-auto rounded-full"></div>
            ) : emotion === "sleepy" ? (
              // Sleepy mouth (ᴗ.ᴗ)
              <div className="w-4 h-1 border-b-2 border-black mx-auto"></div>
            ) : (
              // Default happy mouth (◡‿◡)
              <div className="w-6 h-3 border-b-2 border-black mx-auto" style={{ borderRadius: "0 0 100% 100%" }}></div>
            )}
          </div>

          {/* Blush */}
          <div className="flex gap-8 mt-2">
            <div className="w-4 h-2 bg-pink-400 rounded-full opacity-60"></div>
            <div className="w-4 h-2 bg-pink-400 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Boba Pearls - Inside the Cup */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "1.25rem",
              height: "1.25rem",
              backgroundColor: toppings.length > 0 
                ? TOPPINGS.find(t => t.id === toppings[0])?.color || "#000"
                : "#3A3238",
              filter: "brightness(0.8)",
              bottom: `${10 + (i % 3) * 8}%`,
              left: `${20 + (i * 6)}%`
            }}
            initial={{ y: 0 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
    </div>
  );
}