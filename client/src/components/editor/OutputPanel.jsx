function OutputPanel({ output, error, loading }) {
  return (
    <div className="h-full bg-zinc-950 text-sm font-mono p-4 overflow-auto">
      {loading && (
        <p className="text-yellow-400">Running...</p>
      )}
      {!loading && !output && !error && (
        <p className="text-zinc-500">Output will appear here after you run the code.</p>
      )}
      {output && (
        <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
      )}
      {error && (
        <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
      )}
    </div>
  )
}

export default OutputPanel