interface ProfileMarkProps {
  className?: string
  alt?: string
}

const markUrl = `${import.meta.env.BASE_URL}images/TuJiaLe.png`

/** 使用现有个人标识，并将其统一到 sage 前景色范围内。 */
export default function ProfileMark({ className = '', alt = '涂家乐个人标识' }: ProfileMarkProps) {
  return (
    <img
      src={markUrl}
      alt={alt}
      className={`aspect-square select-none object-contain ${className}`.trim()}
      style={{
        filter: 'brightness(0) saturate(100%) invert(86%) sepia(7%) saturate(390%) hue-rotate(52deg) brightness(93%) contrast(88%)',
      }}
      loading="lazy"
    />
  )
}

