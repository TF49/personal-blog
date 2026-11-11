import { useId, useState, type FormEvent } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useToast } from '@/components/toast/ToastProvider'
import { ICON_SM } from '../icon'

interface ContactComposerProps {
  email: string
  index: number
}

const TOPICS = ['技术交流', '项目合作', '文章反馈', '其他'] as const
type Topic = (typeof TOPICS)[number]

const fieldClass =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-body text-fg placeholder:text-fg-muted focus:border-fg focus:outline-none focus:ring-0'

/**
 * 写信段(sage)。本站没有后端,表单只负责把称呼、话题和内容拼成一封邮件草稿,
 * 交给访客自己的邮件客户端发送;不收集、不存储任何数据。
 */
export default function ContactComposer({ email, index }: ContactComposerProps) {
  const toast = useToast()
  const uid = useId()
  const [topic, setTopic] = useState<Topic>('技术交流')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `[${topic}] 来自${name.trim() || '博客读者'}的来信`
    const body = message.trim()
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      toast.success('邮箱已复制')
    } catch {
      toast.error(`复制失败，请手动复制：${email}`)
    }
  }

  return (
    <div className="site-wrap py-24 md:py-32">
      <div aria-hidden="true" className="flex flex-col gap-2 text-label uppercase">
        <span>{`[ N.${String(index).padStart(3, '0')} ]`}</span>
        <span className="text-fg-muted">( CONTACT. )</span>
      </div>

      <div className="mx-auto mt-12 max-w-[560px] md:mt-4">
        <h2 id="contact-heading" className="text-center text-h1 font-semibold">
          有想法？写封信聊聊。
        </h2>
        <p className="mt-5 text-center text-body text-fg-muted">
          表单只会在你的邮件客户端里生成一封草稿，不经过任何服务器。
        </p>

        <form onSubmit={onSubmit} className="mt-14 flex flex-col gap-8">
          <div>
            <label htmlFor={`${uid}-name`} className="text-label uppercase text-fg-muted">
              称呼
            </label>
            <input
              id={`${uid}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="怎么称呼你"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor={`${uid}-msg`} className="text-label uppercase text-fg-muted">
              想聊的内容
            </label>
            <textarea
              id={`${uid}-msg`}
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="一个问题、一个项目，或者对某篇文章的看法"
              className={`${fieldClass} resize-none`}
            />
          </div>

          <fieldset>
            <legend className="text-label uppercase text-fg-muted">话题</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {TOPICS.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`${uid}-topic`}
                    value={t}
                    checked={topic === t}
                    onChange={() => setTopic(t)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex min-h-11 items-center rounded-pill border border-current px-5 text-label transition-colors duration-200 hover:bg-ink/10 peer-checked:bg-ink peer-checked:text-sage peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-4 flex flex-col items-center gap-4">
            <button
              type="submit"
              className="group inline-flex min-h-12 items-center gap-3 rounded-pill bg-ink px-8 text-label uppercase tracking-[0.08em] text-sage transition-opacity duration-200 hover:opacity-85"
            >
              生成邮件
              <ArrowRightIcon {...ICON_SM} aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex min-h-11 items-center px-2 text-label text-fg-muted underline decoration-1 underline-offset-[6px] hover:text-fg"
            >
              或复制邮箱 {email}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
