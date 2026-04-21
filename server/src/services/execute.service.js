import axios from 'axios'

const ONECOMPILER_URL = 'https://api.onecompiler.com/v1/run'

const LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  typescript: 'typescript',
}

const executeCode = async (code, language, stdin = "") => {
  const API_KEY = process.env.API_KEY // Replace with your actual key
  console.log("Executing via OneCompiler. Lang:", language);
  
  const lang = LANGUAGE_MAP[language]
  if (!lang) throw new Error('Unsupported language')

  try {
    const response = await axios.post(
      ONECOMPILER_URL,
      {
        language: lang,
        stdin: stdin,
        files: [
          {
            name: 'main' + getExtension(lang), // OneCompiler likes extensions
            content: code,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
      }
    )
    // OneCompiler returns { status, stdout, stderr, exception, executionTime }
    const { stdout, stderr, exception } = response.data

    return {
      output: stdout || '',
      error: stderr || exception || '',
      // Map OneCompiler status to a code if needed
      code: response.data.status === 'success' ? 0 : 1,
    }
  } catch (err) {
    console.log("error");
    console.error("OneCompiler Error:", err.response?.data || err.message);
    throw new Error('Code execution failed')
  }
}

// Helper to handle file naming requirements
const getExtension = (lang) => {
  const extMap = { python: '.py', javascript: '.js', java: '.java', cpp: '.cpp', typescript: '.ts' }
  return extMap[lang] || '.txt'
}

export default executeCode