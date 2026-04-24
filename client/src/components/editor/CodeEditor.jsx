import Editor from '@monaco-editor/react'

function defineEditorTheme(monaco) {
  monaco.editor.defineTheme('codesync-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5F7A95', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7DD3FC' },
      { token: 'string', foreground: 'FDE68A' },
      { token: 'number', foreground: 'FDBA74' },
      { token: 'delimiter', foreground: 'CBD5E1' },
    ],
    colors: {
      'editor.background': '#07111E',
      'editor.foreground': '#E2E8F0',
      'editor.lineHighlightBackground': '#102033',
      'editorLineNumber.foreground': '#4A6078',
      'editorLineNumber.activeForeground': '#E2E8F0',
      'editorCursor.foreground': '#FACC15',
      'editor.selectionBackground': '#0EA5E933',
      'editor.inactiveSelectionBackground': '#0F172A',
      'editorIndentGuide.background1': '#132236',
      'editorIndentGuide.activeBackground1': '#1D344E',
    },
  })
}

function CodeEditor({ code, language, onChange }) {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      theme="codesync-night"
      beforeMount={defineEditorTheme}
      onChange={onChange}
      options={{
        fontSize: 15,
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 20, bottom: 20 },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: 'on',
        tabSize: 2,
      }}
    />
  )
}

export default CodeEditor
