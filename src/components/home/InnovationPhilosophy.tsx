import { motion } from 'framer-motion'

export default function InnovationPhilosophy() {
  const philosophyItems = [
    "永无止境的探索",
    "追求卓越工程",
    "以用户为中心",
    "面向未来的技术栈"
  ]

  return (
    <section className="py-24 bg-[var(--color-black)] overflow-hidden relative">
      <div className="container-wide px-6 lg:px-12 mb-6 md:mb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-5xl md:text-7xl text-white leading-none mb-4">
            创新 <br />
            <span className="text-[var(--color-primary)]">哲学</span>
          </h2>
        </motion.div>
      </div>
      
      <div className="relative flex items-center py-2 md:py-4 overflow-hidden border-y border-white/5">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 md:gap-24 pr-8 md:pr-24"
          >
            {[...philosophyItems, ...philosophyItems].map((text, idx) => (
              <span 
                key={idx}
                className="font-display text-4xl md:text-6xl lg:text-8xl text-white/5 tracking-tighter hover:text-[var(--color-primary)]/20 transition-colors duration-700 cursor-default select-none uppercase inline-block"
              >
                {text}
              </span>
            ))}
          </motion.div>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 md:gap-24 pr-8 md:pr-24"
          >
            {[...philosophyItems, ...philosophyItems].map((text, idx) => (
              <span 
                key={idx}
                className="font-display text-4xl md:text-6xl lg:text-8xl text-white/5 tracking-tighter hover:text-[var(--color-primary)]/20 transition-colors duration-700 cursor-default select-none uppercase inline-block"
              >
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container-wide px-6 lg:px-12 relative z-20 mt-6 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-white text-sm md:text-lg leading-relaxed font-light max-w-xl">
              我的哲学根植于这样一个信念：真正的创新源于对<span className="text-white font-medium border-b border-[var(--color-primary)]/50">卓越工程</span>的不懈追求和对人类体验的深刻理解。
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-white text-sm md:text-lg leading-relaxed font-light max-w-xl">
              每一行代码都是创造有意义、持久且强大事物的机会。我们不仅构建软件，我们更在<span className="text-[var(--color-primary)] font-medium">驱动无限可能</span>。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
