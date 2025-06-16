// App.jsx (Styled Components Version)
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Moon, Sun } from 'lucide-react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: sans-serif;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
  }
`;

const themes = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    panel: '#f9f9f9',
    border: '#ccc',
  },
  dark: {
    bg: '#111827',
    text: '#ffffff',
    panel: '#1f2937',
    border: '#374151',
  },
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Navbar = styled.div`
  height: 3rem;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Main = styled.div`
  display: flex;
  height: calc(100vh - 3rem);

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto; /* Adjust height for stacked layout */
  }
`;

const Panel = styled.div`
  width: ${({ width }) => width}%;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    width: 100%;
    border-right: none; /* Remove border for stacked layout */
    border-bottom: 1px solid ${({ theme }) => theme.border}; /* Add bottom border */
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? '2px solid #3b82f6' : 'none')};
  color: ${({ active, theme }) => (active ? '#3b82f6' : theme.text)};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.9rem;
`;

const Resizer = styled.div`
  width: 1px;
  background: gray;
  cursor: col-resize;

  @media (max-width: 768px) {
    display: none; /* Hide resizer on small screens */
  }
`;

const EditorPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.panel}; /* ✅ ADD THIS LINE */
`;


const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.panel};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Label = styled.label`
  width: 8rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.25rem 0.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.panel}; /* ✅ CHANGED from theme.bg to theme.panel */
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;


const Button = styled.button`
  padding: 0.25rem 1rem;
  border-radius: 0.25rem;
  border: none;
  color: white;
  background-color: ${({ color }) => color || '#3b82f6'};
  cursor: pointer;
`;

const Output = styled.div`
  background: ${({ theme }) => theme.panel};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem;
  font-size: 0.8rem;
  height: 7rem;
  overflow-y: auto;
  border-top: 1px solid ${({ theme }) => theme.border};
  white-space: pre-wrap;
`;

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
    <ThemeProvider theme={dark ? themes.dark : themes.light}>
      <GlobalStyle />
      <Container>
        <Navbar>
          <div>AGH-CodeEditor</div>
          <button onClick={() => setDark(!dark)} title="Toggle Theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </Navbar>

        <Main>
          <Panel width={leftWidth}>
            <Tabs>
              {['description', 'submissions', 'solutions'].map((tab) => (
                <Tab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                  {tab}
                </Tab>
              ))}
            </Tabs>

            <Content>
              {activeTab === 'description' && (
                <>
                  <h1>1. Two Sum</h1>
                  <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                  <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                  <pre>Input: nums = [2,7,11,15], target = 9\nOutput: 0,1</pre>
                </>
              )}
              {activeTab === 'submissions' && <p>📄 You haven't submitted any solution yet.</p>}
              {activeTab === 'solutions' && <p>🔐 Unlock to view community solutions.</p>}
            </Content>
          </Panel>

          <Resizer onMouseDown={handleMouseDown} />

          <EditorPanel>
            <InputRow>
              <Label>Function Input:</Label>
              <Input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            </InputRow>
            <InputRow>
              <Label>Expected Output:</Label>
              <Input value={expectedOutput} onChange={(e) => setExpectedOutput(e.target.value)} />
            </InputRow>

            <Toolbar>
              <div>JavaScript</div>
              <div>
                <Button onClick={handleRunCode}>Run</Button>
                <Button color="#10b981">Submit</Button>
              </div>
            </Toolbar>

            <Editor
              height="100%"
              defaultLanguage="javascript"
              defaultValue={`function twoSum(nums, target) {\n  for(let i = 0; i < nums.length; i++) {\n    for(let j = i + 1; j < nums.length; j++) {\n      if(nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n}`}
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

            <Output>{consoleOutput || 'Console output will appear here...'}</Output>
          </EditorPanel>
        </Main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
