import { TeaCustomizer } from "@/components/TeaCustomizer";
import { Achievements } from "@/components/Achievements";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        className="py-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-2">
          Bubble Tea Creator
        </h1>
        <p className="text-muted-foreground">
          Design your perfect bubble tea drink!
        </p>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          <TeaCustomizer />
          <Achievements />
        </div>
      </main>
    </div>
  );
}
