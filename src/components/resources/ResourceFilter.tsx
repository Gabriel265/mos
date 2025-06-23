type FilterProps = {
  subjects: string[]
  levels: string[]
  currentSubject: string
  currentLevel: string
  onChange: (key: 'subject' | 'level', value: string) => void
}

export const ResourceFilter = ({
  subjects,
  levels,
  currentSubject,
  currentLevel,
  onChange
}: FilterProps) => (
  <div className="flex flex-wrap gap-4 mb-4">
    <select
      className="p-2 rounded bg-gray-100 dark:bg-gray-700"
      value={currentSubject}
      onChange={(e) => onChange('subject', e.target.value)}
    >
      <option value="">All Subjects</option>
      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
    </select>

    <select
      className="p-2 rounded bg-gray-100 dark:bg-gray-700"
      value={currentLevel}
      onChange={(e) => onChange('level', e.target.value)}
    >
      <option value="">All Levels</option>
      {levels.map(l => <option key={l} value={l}>{l}</option>)}
    </select>
  </div>
)
