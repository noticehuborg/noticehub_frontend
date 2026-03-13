import { Icon } from '@iconify/react'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function NoticeCard({ notice, onClick }) {
  const { type, title, body, author, course, date } = notice

  return (
    <Card onClick={onClick} className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <Badge type={type} />
        <span className="text-[var(--font-size-text-xs)] text-neutral-gray-6 whitespace-nowrap mt-0.5">
          {formatDate(date)}
        </span>
      </div>

      <h3 className="font-semibold text-[var(--font-size-text-lg)] text-neutral-gray-10 leading-snug line-clamp-2">
        {title}
      </h3>

      <p className="text-[var(--font-size-text-sm)] text-neutral-gray-7 line-clamp-3">
        {body}
      </p>

      <div className="flex items-center justify-between pt-1 mt-auto border-t border-neutral-gray-3">
        <div className="flex items-center gap-1.5 text-[var(--font-size-text-xs)] text-neutral-gray-6">
          <Icon icon="mdi:account-outline" width={14} />
          <span>{course ? `${course} · ` : ''}{author}</span>
        </div>
        <button className="flex items-center gap-1 text-[var(--font-size-text-xs)] font-medium text-primary hover:underline">
          Read more
          <Icon icon="mdi:arrow-right" width={14} />
        </button>
      </div>
    </Card>
  )
}
