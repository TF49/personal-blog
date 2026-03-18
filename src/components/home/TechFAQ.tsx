import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function TechFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const faqs = [
    { q: "这个博客的文章从哪里来？", a: "文章通过 GitHub Issues 发布（带 blog 标签），构建时生成 articles.json，前端静态加载展示。" },
    { q: "你目前主要在学什么方向？", a: "以 Java 后端（Spring Boot）为主，同时学习前端（React/Vue）与 Linux/Docker 部署，把课程项目与实践整理成笔记。" },
    { q: "如何联系你或交流技术？", a: "可以在“关于我”页面找到微信与邮箱；如果你对某篇文章有建议，也欢迎在对应的 GitHub Issue 下评论。" }
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
