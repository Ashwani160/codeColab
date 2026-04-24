import { useState } from 'react'
import { LoaderCircle, Play, TerminalSquare } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

function OutputPanel({ output, error, loading, onRun }) {
  const [stdin, setStdin] = useState('')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-primary">
            <TerminalSquare className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Output console</h2>
            <p className="text-xs text-slate-400">Pass stdin on the left and inspect stdout or errors on the right.</p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
          {loading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Play className="size-3.5 text-primary" />}
          {loading ? 'Execution in progress' : 'Ready to run'}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-px bg-white/[0.08] md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="flex min-h-[180px] flex-col bg-slate-950/[0.78]">
          <div className="border-b border-white/[0.08] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            stdin
          </div>
          <textarea
            className="flex-1 resize-none bg-transparent px-4 py-4 font-mono text-sm text-slate-200 outline-none placeholder:text-slate-500"
            placeholder="Program input here..."
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
          <div className="p-3">
            <Button
              size="lg"
              className="h-11 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onRun(stdin)}
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run with input'}
            </Button>
          </div>
        </div>

        <div className="flex min-h-[180px] flex-col bg-[#09111f]/[0.92]">
          <div className="border-b border-white/[0.08] px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            stdout / stderr
          </div>
          <div className="flex-1 overflow-auto px-4 py-4 font-mono text-sm">
            {loading && <p className="text-amber-200">Running your program...</p>}
            {!loading && !output && !error && (
              <p className="text-slate-500">Output will appear here after you run the code.</p>
            )}
            {output && <pre className="whitespace-pre-wrap text-emerald-300">{output}</pre>}
            {error && <pre className="whitespace-pre-wrap text-rose-300">{error}</pre>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutputPanel
