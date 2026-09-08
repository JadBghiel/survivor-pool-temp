'use client'

export type JobItem = {
  id: string
  title: string
  company: string
  city: string
  contractType: string
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED'
}

const STATUS_STYLES: Record<JobItem['status'], string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400',
  FLAGGED: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400',
}

export default function JobTab({ jobs, onUpdateStatus }: { jobs: JobItem[]; onUpdateStatus: (id: string, s: JobItem['status']) => void }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h2 className="text-base font-bold">Job Post Moderation Queue</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Job Title</th>
              <th className="px-6 py-3 font-semibold">Company</th>
              <th className="px-6 py-3 font-semibold">Location</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {jobs.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No jobs to display.</td></tr>
            ) : (
              jobs.map((j) => (
                <tr key={j.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="px-6 py-4 font-medium">{j.title}</td>
                  <td className="px-6 py-4 text-neutral-500">{j.company}</td>
                  <td className="px-6 py-4">{j.city}</td>
                  <td className="px-6 py-4 font-mono text-[11px]">{j.contractType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[j.status]}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {j.status !== 'PUBLISHED' && (
                      <button onClick={() => onUpdateStatus(j.id, 'PUBLISHED')} className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-500">
                        Approve
                      </button>
                    )}
                    {j.status !== 'FLAGGED' && (
                      <button onClick={() => onUpdateStatus(j.id, 'FLAGGED')} className="rounded bg-red-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-red-500">
                        Flag / Hide
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}