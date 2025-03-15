import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DrinkCanvas } from "./DrinkCanvas";
import { Ingredients } from "./Ingredients";
import { ShareModal } from "./ShareModal";
import { TEA_BASES, SWEETNESS_LEVELS, ICE_LEVELS, SPECIAL_COMBINATIONS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function TeaCustomizer() {
  const [primaryBase, setPrimaryBase] = useState(TEA_BASES[0]);
  const [secondaryBase, setSecondaryBase] = useState<typeof TEA_BASES[0] | null>(null);
  const [toppings, setToppings] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState(50);
  const [iceLevel, setIceLevel] = useState(50);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSpecialCombo, setIsSpecialCombo] = useState(false);
  const { toast } = useToast();

  // Check for special combinations
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

  const handleSave = async () => {
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

      toast({
        title: "🎉 Recipe saved!",
        description: "Your bubble tea creation has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <DrinkCanvas
              base={primaryBase}
              secondaryBase={secondaryBase}
              toppings={toppings}
              sweetness={sweetness}
              iceLevel={iceLevel}
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
                onValueChange={(value) => setSweetness(value[0])}
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
                onValueChange={(value) => setIceLevel(value[0])}
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
        onToppingsChange={setToppings}
      />

      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          Save Creation
        </Button>
        <Button variant="outline" onClick={() => setIsShareOpen(true)} className="flex-1">
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