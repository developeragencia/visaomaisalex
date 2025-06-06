import { motion } from "framer-motion";
// Logo substituído por texto

export default function LoadingScreen() {
  return (
    <motion.div 
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      />
      
      {/* Logo Container */}
      <motion.div 
        className="relative z-10 mb-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          delay: 0.3
        }}
      >
        {/* Logo usando a imagem real */}
        <motion.div 
          className="h-20 w-auto flex items-center justify-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <img 
            src="/logo-horizontal-roxa.png" 
            alt="Visão+" 
            className="h-16 w-auto object-contain"
          />
        </motion.div>
      </motion.div>
      
      {/* Loading indicator */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="flex space-x-2">
          <motion.div 
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1,
              repeatDelay: 0.2
            }}
          />
          <motion.div 
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1,
              delay: 0.2,
              repeatDelay: 0.2
            }}
          />
          <motion.div 
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1,
              delay: 0.4,
              repeatDelay: 0.2
            }}
          />
        </div>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        className="mt-4 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        Carregando...
      </motion.div>
    </motion.div>
  );
}
