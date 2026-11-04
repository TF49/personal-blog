interface ArticleBodyProps {
  /** Pre-sanitized HTML string (sanitized by DOMPurify in BlogPost) */
  html: string
}

/**
 * Renders sanitized article HTML with proper typography via .article-body CSS class.
 * Content must be pre-sanitized before passing in.
 */
export default function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <div
      className="article-body"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
