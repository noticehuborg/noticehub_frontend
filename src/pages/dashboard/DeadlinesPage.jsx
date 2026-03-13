import { Icon } from '@iconify/react'
import { useNotices } from '../../hooks/useNotices'

const typeStyles = {
  assignment: { icon: 'mdi:book-open-outline', bg: 'bg-warning-2', text: 'text-warning-9', border: 'border-warning-4' },
  exam:       { icon: 'mdi:file-document-outline', bg: 'bg-error-2', text: 'text-error-8', border: 'border-error-4' },
  general:    { icon: 'mdi:calendar-outline', bg: 'bg-blue-1', text: 'text-blue-8', border: 'border-blue-3' },
}

function getDaysLeft(dueDateISO) {
  const now = new Date()
  const due = new Date(dueDateISO)
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  return diff
}

function formatDueDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function DeadlinesPage() {
  const { deadlines, loading } = useNotices()

  const sorted = [...deadlines].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-mobile-h3 md:text-mobile-h2 font-bold text-neutral-gray-10">Deadlines</h1>
        <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6 mt-1">
          Upcoming deadlines sorted by due date.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="card-base h-24 animate-pulse bg-neutral-gray-2" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((d) => {
            const daysLeft = getDaysLeft(d.dueDate)
            const style = typeStyles[d.type] || typeStyles.general
            const urgent = daysLeft <= 3

            return (
              <div key={d.id} className={`card-base p-5 flex items-center gap-5 border-l-4 ${style.border}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.bg} ${style.text} shrink-0`}>
                  <Icon icon={style.icon} width={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--font-size-text-base)] text-neutral-gray-10 truncate">{d.title}</p>
                  <p className="text-[var(--font-size-text-xs)] text-neutral-gray-6 mt-0.5">
                    {d.course && <span className="font-medium">{d.course} · </span>}
                    Due: {formatDueDate(d.dueDate)}
                  </p>
                </div>

                <div className={`text-right shrink-0 ${urgent ? 'text-error-7' : 'text-neutral-gray-7'}`}>
                  <p className={`font-bold text-[var(--font-size-text-lg)] ${urgent ? 'text-error-7' : 'text-neutral-gray-10'}`}>
                    {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d`}
                  </p>
                  <p className="text-[var(--font-size-text-xs)]">{daysLeft > 0 ? 'left' : ''}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
