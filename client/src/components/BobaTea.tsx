import { motion } from "framer-motion";
import { TEA_BASES } from "@/lib/constants";

interface BobaTeaProps {
  base: typeof TEA_BASES[0];
  secondaryBase: typeof TEA_BASES[0] | null;
  toppings: string[];
  sweetness: number;
  iceLevel: number;
  isOrdered: boolean;
}

export const BobaTea = ({ 
  base,
  secondaryBase,
  isOrdered 
}: BobaTeaProps) => {
  return (
    <div className="relative w-40 h-72">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="relative w-full h-full"
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
        <div className="absolute w-full h-full rounded-b-full border-4 border-gray-300 shadow-lg overflow-hidden">
          <div 
            className="w-full h-full"
            style={{
              background: secondaryBase 
                ? `linear-gradient(to bottom, ${base.color} 40%, ${secondaryBase.color})`
                : base.color
            }}
          />
        </div>

        {/* Boba Pearls - Inside the Cup */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 bg-black rounded-full"
            initial={{ y: 0 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.15 }}
            style={{ bottom: `${10 + (i % 3) * 8}%`, left: `${20 + (i * 6)}%` }}
          />
        ))}

        {/* Kawaii Face */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30">
          {/* Happy Eyes */}
          <div className="flex gap-4">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          {/* Cute Smile */}
          <div className="mt-2 w-6 h-3 border-b-2 border-black mx-auto"></div>
          {/* Blush */}
          <div className="flex gap-8 mt-2">
            <div className="w-4 h-2 bg-pink-200 rounded-full opacity-60"></div>
            <div className="w-4 h-2 bg-pink-200 rounded-full opacity-60"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
