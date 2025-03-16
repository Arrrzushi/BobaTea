import { TeaCustomizer } from "@/components/TeaCustomizer";
import { Achievements } from "@/components/Achievements";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar */}
      <motion.nav 
        className="py-4 px-8 flex justify-end space-x-6 text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <a 
          href="https://github.com/Arrrzushi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          GitHub
        </a>
        <a 
          href="https://www.instagram.com/your_deathmate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Instagram
        </a>
      </motion.nav>

      {/* Main Content Wrapper */}
      <div className="flex-grow">
        {/* Header */}
        <motion.header 
          className="py-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary mb-2">
            Boba Shop!🧋
          </h1>
          <p className="text-muted-foreground">
            Design your perfect bubble tea drink!
          </p>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
            <TeaCustomizer />
            <Achievements />
          </div>
        </main>
      </div>

      {/* Cute Footer (Sticks to Bottom) */}
      <motion.footer 
        className="py-6 text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        🍵 Made with stupidity by <span className="text-primary font-semibold">Café Owner Arushi</span> 
      </motion.footer>
    </div>
  );
}
