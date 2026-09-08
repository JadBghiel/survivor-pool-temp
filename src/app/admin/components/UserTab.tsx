'use client'

export type UserRole = 'SEEKER' | 'EMPLOYER' | 'ADMIN'

export type UserItem = {
  id: string
  email: string
  role: UserRole
  createdAt: string
  status: 'ACTIVE' | 'SUSPENDED'
  seekerProfile?: { firstName: string; lastName: string } | null
  employerProfile?: { companyName: string } | null
}

export default function UserTab({ users, onToggleStatus }: { users: UserItem[]; onToggleStatus: (id: string, s: 'ACTIVE' | 'SUSPENDED') => void }) {
  const getName = (u: UserItem) =>
    u.role === 'EMPLOYER'
      ? u.employerProfile?.companyName || 'N/A'
      : `${u.seekerProfile?.firstName || ''} ${u.seekerProfile?.lastName || ''}`.trim() || 'N/A'

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h2 className="text-base font-bold">Registered Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
            <tr>
              <th className="px-6 py-3 font-semibold">User / Profile</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Joined</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {users.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No users found.</td></tr>
            ) : (
              users.map((u) => {
                const isActive = u.status === 'ACTIVE'
                return (
                  <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="px-6 py-4 font-medium">{getName(u)}</td>
                    <td className="px-6 py-4 text-neutral-500">{u.email}</td>
                    <td className="px-6 py-4 font-semibold">{u.role}</td>
                    <td className="px-6 py-4 text-neutral-500">{u.createdAt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onToggleStatus(u.id, u.status)}
                        className={`rounded px-2.5 py-1 text-[11px] font-medium ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'}`}
                      >
                        {isActive ? 'Suspend' : 'Unsuspend'}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}