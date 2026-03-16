import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function TechFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const faqs = [
    { q: "你的主要开发技术栈是什么？", a: "我专注于“强力技术栈”：使用 Spring Boot 构建稳健的后端，使用 React/Next.js 打造高性能的前端界面。" },
    { q: "你如何确保应用的性能？", a: "通过严格的优化、缓存策略和受高端制造业启发的工业级工程实践来确保卓越性能。" },
    { q: "你接受全球范围的合作吗？", a: "当然。我具备全球化协作能力，能够跨越不同时区 and 文化与技术领域进行连接。" }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--color-black)] mb-8">
              常见问题 <br />
              <span className="text-[var(--color-primary)]">解答</span>
            </h2>
            <p className="text-[var(--color-muted)] text-lg font-light">深入了解我的技术方法论和职业哲学。</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-accordion-item border-b border-gray-100 pb-6 cursor-pointer ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              >
                <div className="flex justify-between items-center group">
                  <h3 className={`font-display text-xl transition-colors ${activeIndex === idx ? 'text-[var(--color-primary)]' : 'text-[var(--color-black)] group-hover:text-[var(--color-primary)]'}`}>
                    {faq.q}
                  </h3>
                  <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-500 ${activeIndex === idx ? 'rotate-180 bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : ''}`}>
                    <ArrowRight size={16} className="rotate-90" />
                  </div>
                </div>
                <div className="faq-accordion-content">
                  <p className="pt-6 text-[var(--color-muted)] leading-relaxed font-light text-lg">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
