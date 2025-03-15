import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ACHIEVEMENTS } from "@/lib/constants";
import type { Achievement } from "@shared/schema";
import { motion } from "framer-motion";

export function Achievements() {
  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements/user"],
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      <div className="space-y-4">
        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = achievements?.some(
            (a) => a.type === achievement.id
          );

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                isUnlocked
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/50 border-border"
              }`}
            >
              <h3 className="font-medium">{achievement.name}</h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
