interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = '',
  color = '#ffffff',
  shineColor = 'var(--color-primary, #f6b500)',
}: ShinyTextProps) {
  const animationDuration = `${speed}s`

  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent ${
        disabled ? '' : 'animate-shiny-text'
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, ${color} 40%, ${shineColor} 50%, ${color} 60%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: disabled ? 'none' : animationDuration,
      }}
    >
      {text}
    </span>
  )
}
