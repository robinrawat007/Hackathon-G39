"use client"

import { BookCoverImage } from "@/components/books/book-cover-image"

type Props = {
  src: string
  title: string
  author: string
}

/** Detail page hero cover — higher-res Google Books tier + loader. */
export function BookDetailCover({ src, title, author }: Props) {
  return (
    <BookCoverImage
      src={src}
      alt={`${title} by ${author} book cover`}
      fill
      sizes="(max-width: 768px) 55vw, 320px"
      tier="detail"
      priority
      className="object-cover"
    />
  )
}
