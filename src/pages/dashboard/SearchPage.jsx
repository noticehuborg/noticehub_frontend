import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import NoticeCard from '../../components/common/NoticeCard'
import { useNotices } from '../../hooks/useNotices'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = searchParams.get('q') || ''
  const [query, setQuery] = useState(initial)
  const { notices } = useNotices()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        (n.course && n.course.toLowerCase().includes(q)) ||
        n.author.toLowerCase().includes(q)
    )
  }, [query, notices])

  function handleChange(e) {
    setQuery(e.target.value)
    setSearchParams(e.target.value ? { q: e.target.value } : {})
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-mobile-h3 md:text-mobile-h2 font-bold text-neutral-gray-10">Search</h1>
        <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6 mt-1">
          Search across all notices, courses, and authors.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Icon
          icon="mdi:magnify"
          width={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray-6"
        />
        <input
          value={query}
          onChange={handleChange}
          placeholder="Search notices..."
          autoFocus
          className="input-base pl-11 py-4 text-[var(--font-size-text-base)]"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSearchParams({}) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray-5 hover:text-neutral-gray-9 transition-colors"
          >
            <Icon icon="mdi:close" width={18} />
          </button>
        )}
      </div>

      {/* Results */}
      {!query.trim() ? (
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <Icon icon="mdi:magnify" width={40} className="text-neutral-gray-4" />
          <p className="text-[var(--font-size-text-lg)] font-medium text-neutral-gray-7">Start typing to search</p>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-5">
            Search by notice title, course code, or author.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <Icon icon="mdi:file-search-outline" width={40} className="text-neutral-gray-4" />
          <p className="text-[var(--font-size-text-lg)] font-medium text-neutral-gray-7">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-5">
            Try different keywords or check the spelling.
          </p>
        </div>
      ) : (
        <>
          <p className="text-[var(--font-size-text-sm)] text-neutral-gray-6">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((n) => <NoticeCard key={n.id} notice={n} />)}
          </div>
        </>
      )}
    </div>
  )
}
