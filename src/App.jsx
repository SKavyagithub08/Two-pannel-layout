// App.jsx
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Moon, Sun } from 'lucide-react';
import './App.css';
import './index.css';

function App() {
  const [leftWidth, setLeftWidth] = useState(40);
  const isResizing = useRef(false);
  const [activeTab, setActiveTab] = useState('description');
  const [dark, setDark] = useState(false);
  const [userInput, setUserInput] = useState('[2,7,11,15], 9');
  const [expectedOutput, setExpectedOutput] = useState('0,1');
  const [consoleOutput, setConsoleOutput] = useState('');
  const editorRef = useRef(null);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 15 && newLeftWidth < 85) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleRunCode = () => {
    const code = editorRef.current?.getValue() || '';
    const logs = [];
    const originalLog = console.log;

    try {
      console.log = (...args) => logs.push(args.join(' '));
      const fullCode = `${code}\n\nconsole.log(twoSum(${userInput}));`;
      eval(fullCode);
      const output = logs.join('\n');
      setConsoleOutput(
        `Expected Output: ${expectedOutput}\nActual Output: ${output}\n\n${expectedOutput.trim() === output.trim() ? 'Passed!' : 'Failed'}`
      );
    } catch (err) {
      setConsoleOutput('Error: ' + err.toString());
    } finally {
      console.log = originalLog;
    }
  };

  return (
    <div className={`${dark ? 'dark' : ''} h-screen w-screen overflow-hidden`}> 
      <div className="h-12 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-4 text-sm dark:text-white">
        <div className="font-bold">AGH-CodeEditor</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="hover:scale-105 transition"
            title="Toggle Theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-3rem)] w-full flex font-sans overflow-hidden dark:bg-gray-900">
        <div
          style={{ width: `${leftWidth}%` }}
          className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 flex flex-col border-r border-gray-300 dark:border-gray-700 overflow-hidden"
        >
          <div className="flex-shrink-0 text-sm font-medium border-b border-gray-300 dark:border-gray-700">
            {['description', 'submissions', 'solutions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 capitalize ${activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 text-sm">
            {activeTab === 'description' && (
              <>
                <h1 className="text-xl font-semibold mb-2">1. Two Sum</h1>
                <p>
                  Given an array of integers <code>nums</code> and an integer{' '}
                  <code>target</code>, return indices of the two numbers such that they
                  add up to <code>target</code>.
                </p>
                <p className="mt-2">
                  You may assume that each input would have exactly one solution, and you
                  may not use the same element twice.
                </p>
                <div className="mt-4">
                  <strong>Example:</strong>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 text-xs">
                    {`Input: nums = [2,7,11,15], target = 9\nOutput: 0,1`}
                  </pre>
                </div>
              </>
            )}
            {activeTab === 'submissions' && <p>📄 You haven't submitted any solution yet.</p>}
            {activeTab === 'solutions' && <p>🔐 Unlock to view community solutions.</p>}
          </div>
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-gray-400 cursor-col-resize"
        ></div>

        <div className="flex-1 flex flex-col overflow-hidden dark:bg-gray-900">
          <div className="flex flex-col gap-2 p-3 text-sm bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <label className="w-32 text-gray-700 dark:text-gray-300">Function Input:</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-black"
                placeholder="[2,7,11,15], 9"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-gray-700 dark:text-gray-300">Expected Output:</label>
              <input
                type="text"
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-black"
                placeholder="0,1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              JavaScript
            </div>
            <div className="space-x-2">
              <button
                onClick={handleRunCode}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
              >
                Run
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1 rounded">
                Submit
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue={`function twoSum(nums, target) {
  for(let i = 0; i < nums.length; i++) {
    for(let j = i + 1; j < nums.length; j++) {
      if(nums[i] + nums[j] === target) return [i, j];
    }
  }
}`}
              theme={dark ? 'vs-dark' : 'vs-light'}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                autoClosingBrackets: 'never'
              }}
              onMount={(editor) => (editorRef.current = editor)}
            />
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-300 p-3 border-t border-gray-300 dark:border-gray-700 h-28 overflow-y-auto whitespace-pre-wrap">
            {consoleOutput || 'Console output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
