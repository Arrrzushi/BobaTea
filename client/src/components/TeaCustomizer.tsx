import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DrinkCanvas } from "./DrinkCanvas";
import { Ingredients } from "./Ingredients";
import { ShareModal } from "./ShareModal";
import { TEA_BASES, SWEETNESS_LEVELS, ICE_LEVELS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function TeaCustomizer() {
  const [base, setBase] = useState(TEA_BASES[0]);
  const [toppings, setToppings] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState(50);
  const [iceLevel, setIceLevel] = useState(50);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await apiRequest("POST", "/api/recipes", {
        name: `${base.name} Tea`,
        base: base.id,
        toppings,
        sweetness,
        iceLevel,
        creator: "user",
      });

      toast({
        title: "Recipe saved!",
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
          <DrinkCanvas
            base={base}
            toppings={toppings}
            sweetness={sweetness}
            iceLevel={iceLevel}
          />
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Choose your tea base</h3>
              <div className="grid grid-cols-2 gap-2">
                {TEA_BASES.map((teaBase) => (
                  <motion.button
                    key={teaBase.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg border ${
                      base.id === teaBase.id
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                    onClick={() => setBase(teaBase)}
                  >
                    {teaBase.name}
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
              />
            </div>

            <div>
              <h3 className="font-medium mb-3">Ice Level</h3>
              <Slider
                value={[iceLevel]}
                onValueChange={(value) => setIceLevel(value[0])}
                max={100}
                step={25}
              />
            </div>
          </div>
        </div>
      </Card>

      <Ingredients
        selectedToppings={toppings}
        onToppingsChange={setToppings}
      />

      <div className="flex gap-4">
        <Button onClick={handleSave}>Save Creation</Button>
        <Button variant="outline" onClick={() => setIsShareOpen(true)}>
          Share
        </Button>
      </div>

      <ShareModal
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        recipe={{
          base: base.id,
          toppings,
          sweetness,
          iceLevel,
        }}
      />
    </div>
  );
}
