import { Code2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
]

function LanguageSelect({ language, onChange }) {
  return (
    <Select value={language} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-[170px] rounded-2xl border-white/10 bg-white/[0.06] px-4 text-sm text-white">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-accent" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="border-white/10 bg-slate-950/96 text-white">
        {LANGUAGES.map((languageOption) => (
          <SelectItem key={languageOption.value} value={languageOption.value}>
            {languageOption.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguageSelect
