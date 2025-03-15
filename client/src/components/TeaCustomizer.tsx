import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BobaTea } from "./BobaTea";
import { Ingredients } from "./Ingredients";
import { ShareModal } from "./ShareModal";
import { TEA_BASES, SPECIAL_COMBINATIONS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { TeaRecipe } from "@shared/schema";

export function TeaCustomizer() {
  const [primaryBase, setPrimaryBase] = useState(TEA_BASES[0]);
  const [secondaryBase, setSecondaryBase] = useState<typeof TEA_BASES[0] | null>(null);
  const [toppings, setToppings] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState(50);
  const [iceLevel, setIceLevel] = useState(50);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSpecialCombo, setIsSpecialCombo] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all recipes
  const { data: recipes } = useQuery<TeaRecipe[]>({
    queryKey: ['/api/recipes'],
  });

  useEffect(() => {
    const currentBases = [primaryBase.id, secondaryBase?.id].filter(Boolean);
    const hasSpecialCombo = SPECIAL_COMBINATIONS.some(combo => 
      combo.bases.every(base => currentBases.includes(base)) &&
      combo.toppings.every(topping => toppings.includes(topping))
    );

    if (hasSpecialCombo && !isSpecialCombo) {
      setIsSpecialCombo(true);
      toast({
        title: "✨ Special Combination Discovered!",
        description: "You've created a magical blend!",
        duration: 3000,
      });
    }
  }, [primaryBase, secondaryBase, toppings]);

  const handleOrder = async () => {
    try {
      await apiRequest("POST", "/api/recipes", {
        name: secondaryBase 
          ? `${primaryBase.name} & ${secondaryBase.name} Mix`
          : `${primaryBase.name} Tea`,
        base: primaryBase.id,
        toppings,
        sweetness,
        iceLevel,
        creator: "user",
      });

      setIsOrdered(true);
      setShowCelebration(true);
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });

      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);

      toast({
        title: "🧋 Order Complete!",
        description: "Enjoy your bubble tea creation!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {showCelebration && (
        <motion.div 
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4"
              initial={{
                top: "50%",
                left: "50%",
                scale: 0
              }}
              animate={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <span className="text-2xl">🎉</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative flex justify-center items-center"
          >
            <BobaTea
              base={primaryBase}
              secondaryBase={secondaryBase}
              toppings={toppings}
              sweetness={sweetness}
              iceLevel={iceLevel}
              isOrdered={isOrdered}
            />
            {isSpecialCombo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-0 right-0"
              >
                <Badge variant="secondary" className="bg-primary/20">
                  ✨ Special Combo!
                </Badge>
              </motion.div>
            )}
          </motion.div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Choose your tea base(s)</h3>
              <div className="grid grid-cols-2 gap-2">
                {TEA_BASES.map((teaBase) => (
                  <motion.button
                    key={teaBase.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg border relative ${
                      primaryBase.id === teaBase.id
                        ? "border-primary bg-primary/10"
                        : secondaryBase?.id === teaBase.id
                        ? "border-secondary bg-secondary/10"
                        : "border-border"
                    }`}
                    onClick={() => {
                      if (primaryBase.id === teaBase.id) {
                        setPrimaryBase(teaBase);
                        setSecondaryBase(null);
                      } else if (secondaryBase?.id === teaBase.id) {
                        setSecondaryBase(null);
                      } else if (!secondaryBase) {
                        setSecondaryBase(teaBase);
                      } else {
                        setPrimaryBase(teaBase);
                      }
                      setIsOrdered(false);
                    }}
                  >
                    {teaBase.name}
                    <div
                      className="w-4 h-4 rounded-full absolute top-1 right-1"
                      style={{ backgroundColor: teaBase.color }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Sweetness</h3>
              <Slider
                value={[sweetness]}
                onValueChange={(value) => {
                  setSweetness(value[0]);
                  setIsOrdered(false);
                }}
                max={100}
                step={25}
                className="py-4"
              />
              <p className="text-sm text-muted-foreground text-center">
                {sweetness}% Sweet
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-3">Ice Level</h3>
              <Slider
                value={[iceLevel]}
                onValueChange={(value) => {
                  setIceLevel(value[0]);
                  setIsOrdered(false);
                }}
                max={100}
                step={25}
                className="py-4"
              />
              <p className="text-sm text-muted-foreground text-center">
                {iceLevel}% Ice
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Ingredients
        selectedToppings={toppings}
        onToppingsChange={(newToppings) => {
          setToppings(newToppings);
          setIsOrdered(false);
        }}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Creation History</h2>
        <div className="space-y-4">
          {recipes?.map((recipe) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{recipe.name}</h3>
                <Badge variant="secondary">{recipe.likes} Likes</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {recipe.toppings.join(", ")} • {recipe.sweetness}% Sweet • {recipe.iceLevel}% Ice
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button 
          onClick={handleOrder} 
          className="flex-1"
          disabled={isOrdered}
        >
          {isOrdered ? "Ordered! 🧋" : "Order Now"}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setIsShareOpen(true)} 
          className="flex-1"
        >
          Share
        </Button>
      </div>

      <ShareModal
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        recipe={{
          base: primaryBase.id,
          secondaryBase: secondaryBase?.id,
          toppings,
          sweetness,
          iceLevel,
        }}
      />
    </div>
  );
}