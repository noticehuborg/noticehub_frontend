import NoticeCard from '../../components/common/NoticeCard'
import { useNotices } from '../../hooks/useNotices'

export default function AssignmentNoticePage() {
  const { notices, loading } = useNotices()
  const assignments = notices.filter((n) => n.type === 'assignment')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-mobile-h3 md:text-mobile-h2 font-bold text-neutral-gray-10">Assignment Notices</h1>
        <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6 mt-1">
          Assignment announcements and submission deadlines.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="card-base h-48 animate-pulse bg-neutral-gray-2" />)}
        </div>
      ) : assignments.length === 0 ? (
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <p className="text-[var(--font-size-text-lg)] font-medium text-neutral-gray-7">No assignment notices</p>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-5">Assignment notices will appear here when posted.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignments.map((n) => <NoticeCard key={n.id} notice={n} />)}
        </div>
      )}
    </div>
  )
}
