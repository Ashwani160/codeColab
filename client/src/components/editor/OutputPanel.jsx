import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'

function OutputPanel({ output, error, loading, onRun }) {
  const [stdin, setStdin] = useState('')

  return (
    <div className="h-full flex bg-zinc-950 text-sm font-mono overflow-hidden">

      {/* left: stdin */}
      <div className="w-48 flex flex-col border-r border-zinc-800">
        <div className="px-3 py-1 text-xs text-zinc-500 border-b border-zinc-800">
          stdin (input)
        </div>
        <textarea
          className="flex-1 bg-transparent text-zinc-300 p-2 text-xs resize-none outline-none"
          placeholder="Program input here..."
          value={stdin}
          onChange={e => setStdin(e.target.value)}
        />
        <Button
          size="sm"
          className="m-2"
          onClick={() => onRun(stdin)}
          disabled={loading}
        >
          {loading ? 'Running...' : 'Run'}
        </Button>
      </div>

      {/* right: output */}
      <div className="flex-1 p-4 overflow-auto">
        {loading && <p className="text-yellow-400">Running...</p>}
        {!loading && !output && !error && (
          <p className="text-zinc-500">Output will appear here after you run the code.</p>
        )}
        {output && <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>}
        {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
      </div>

    </div>
  )
}

export default OutputPanel