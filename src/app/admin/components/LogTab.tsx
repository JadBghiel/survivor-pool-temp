'use client'

export type ActivityLog = { id: string; action: string; target: string; timestamp: string; actor: string }

export default function LogTab({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h2 className="text-base font-bold">System Audit Trail</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3 font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-xs text-neutral-500">No activity logged yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-red-600 dark:text-red-400">[{log.action}]</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{log.target}</span>
                </div>
                <div className="text-[11px] text-neutral-400">By {log.actor} on {log.timestamp}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}