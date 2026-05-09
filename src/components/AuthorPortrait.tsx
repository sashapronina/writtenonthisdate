type AuthorPortraitProps = {
  author: string
  imageUrl: string
  className?: string
}

export function AuthorPortrait({ author, imageUrl, className }: AuthorPortraitProps) {
  const rootClass = className ? `author-portrait ${className}` : 'author-portrait'

  return (
    <figure className={rootClass}>
      <div className="author-portrait__frame">
        <img
          src={imageUrl}
          alt={`Portrait of ${author}`}
          width={248}
          height={274}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="author-portrait__caption">{author}</figcaption>
    </figure>
  )
}
