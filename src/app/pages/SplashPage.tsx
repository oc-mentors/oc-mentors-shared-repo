import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

export default function SplashPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    // Start page flip after 5 seconds
    const flipTimer = setTimeout(() => {
      setIsFlipping(true);
    }, 5000);

    // Navigate to login after animations complete
    const navTimer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 6500);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-[#2c3042] via-[#353a52] to-[#2a2f45] flex items-center justify-center overflow-hidden"
          style={{
            perspective: "2500px",
          }}
        >
          {/* Subtle texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Animated gradient orbs for depth */}
          <motion.div 
            className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          {/* Logo container with page flip animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: isFlipping ? 0 : 1, 
              scale: 1, 
              y: 0,
              rotateX: isFlipping ? 90 : 0,
            }}
            transition={{ 
              opacity: { 
                duration: isFlipping ? 1.2 : 1, 
                ease: "easeOut", 
                delay: isFlipping ? 0 : 0.2 
              },
              scale: { duration: 1, ease: "easeOut", delay: 0.2 },
              y: { duration: 1, ease: "easeOut", delay: 0.2 },
              rotateX: { 
                duration: 1.2, 
                ease: [0.65, 0, 0.35, 1]
              },
            }}
            className="relative z-10"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "bottom center",
            }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              animate={{
                opacity: isFlipping ? 0 : [0.4, 0.7, 0.4],
                scale: [1, 1.15, 1],
              }}
              transition={{
                opacity: {
                  duration: isFlipping ? 0.8 : 3,
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
              className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-blue-500/30 to-teal-500/20 blur-3xl rounded-full"
            />
            
            {/* Logo card - Front */}
            <div 
              className="relative bg-gradient-to-br from-[#1e2139] to-[#252837] rounded-[2rem] p-16 shadow-2xl border border-white/10"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-[2rem]" />
              
              <motion.div
                animate={{
                  y: isFlipping ? 0 : [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: isFlipping ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <h1 className="text-5xl sm:text-6xl font-bold text-center bg-gradient-to-br from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                  Socratic OC
                </h1>
              </motion.div>
              
              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-purple-400/30 rounded-tl-xl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-xl" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400/30 rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-teal-400/30 rounded-br-xl" />
            </div>

            {/* Logo card - Back (matching dark background) */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-[#2c3042] via-[#353a52] to-[#2a2f45] rounded-[2rem] shadow-2xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            />
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipping ? 0 : 1 }}
            transition={{ 
              opacity: {
                duration: isFlipping ? 0.5 : 0.8,
                delay: isFlipping ? 0 : 1
              }
            }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex gap-2">
              <motion.div 
                className="w-2.5 h-2.5 bg-purple-400/60 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div 
                className="w-2.5 h-2.5 bg-blue-400/60 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              />
              <motion.div 
                className="w-2.5 h-2.5 bg-teal-400/60 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
              />
            </div>
          </motion.div>

          {/* Subtle animated particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}