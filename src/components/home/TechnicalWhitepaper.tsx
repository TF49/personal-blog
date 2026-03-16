import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function TechnicalWhitepaper() {
  const papers = [
    { title: '高性能后端扩展指南', code: 'WP-2024-01', size: '2.4 MB', tag: '架构设计' },
    { title: '现代前端编排艺术', code: 'WP-2024-02', size: '1.8 MB', tag: 'UI/UX 设计' },
    { title: '工业级安全协议实践', code: 'WP-2024-03', size: '3.1 MB', tag: '系统安全' }
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-wide px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="lg:w-1/2">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-6">
              技术 <br />
              <span className="text-[var(--color-primary)]">白皮书</span>
            </h2>
            <p className="text-[var(--color-muted)] text-xl font-light leading-relaxed">
              深入探讨卓越工程与工业化标准。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {papers.map((paper, idx) => (
            <motion.div
              key={paper.code}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row items-center justify-between p-8 border border-gray-100 hover:border-[var(--color-primary)] hover:bg-gray-50 transition-all duration-500 cursor-pointer"
            >
              <div className="flex items-center gap-8 mb-6 md:mb-0">
                <div className="font-display text-xs text-[var(--color-primary)] px-3 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                  {paper.code}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[var(--color-black)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {paper.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{paper.tag}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{paper.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none border border-gray-200 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
