import { useState } from 'react'
import Tabs from '../../components/ui/Tabs'
import NoticeCard from '../../components/common/NoticeCard'
import { useNotices } from '../../hooks/useNotices'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'exam', label: 'Exams' },
  { value: 'resource', label: 'Resources' },
]

export default function FeedPage() {
  const { notices, loading } = useNotices()
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all' ? notices : notices.filter((n) => n.type === activeTab)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-mobile-h3 md:text-mobile-h2 font-bold text-neutral-gray-10">Notice Feed</h1>
        <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6 mt-1">
          All your university notices in one place.
        </p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-base p-6 h-40 animate-pulse bg-neutral-gray-2" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <p className="text-[var(--font-size-text-lg)] font-medium text-neutral-gray-7">No notices yet</p>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-5">
            Check back later — notices will appear here when posted.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </div>
  )
}
