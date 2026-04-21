import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python',     label: 'Python'     },
  { value: 'cpp',        label: 'C++'        },
  { value: 'java',       label: 'Java'       },
  { value: 'typescript', label: 'TypeScript' },
]

function LanguageSelect({ language, onChange }) {
  return (
    <Select value={language} onValueChange={onChange}>
      <SelectTrigger className="w-36 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(l => (
          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguageSelect