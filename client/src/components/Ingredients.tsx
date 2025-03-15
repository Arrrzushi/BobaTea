import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TOPPINGS } from "@/lib/constants";

interface IngredientsProps {
  selectedToppings: string[];
  onToppingsChange: (toppings: string[]) => void;
}

export function Ingredients({ selectedToppings, onToppingsChange }: IngredientsProps) {
  const toggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      onToppingsChange([]);
    } else {
      onToppingsChange([toppingId]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-medium mb-4">Choose Your Topping</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {TOPPINGS.map((topping) => (
          <motion.button
            key={topping.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg border text-center ${
              selectedToppings.includes(topping.id)
                ? "border-primary bg-primary/10"
                : "border-border"
            }`}
            onClick={() => toggleTopping(topping.id)}
          >
            <div
              className="w-8 h-8 rounded-full mx-auto mb-2"
              style={{ backgroundColor: topping.color }}
            />
            <span className="text-sm">{topping.name}</span>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}