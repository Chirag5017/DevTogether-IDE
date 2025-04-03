import { useState, useRef, useEffect } from 'react'
import FileTree from './components/FileTree'
import Terminal from './components/Terminal'
import Editor from './components/Editor.jsx'

const App = () => {
  const [selectedFile, setSelectedFile] = useState("")
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [terminalHeight, setTerminalHeight] = useState(180)
  const sidebarRef = useRef(null)
  const terminalRef = useRef(null)
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false)
  
  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingSidebar) {
        const newWidth = e.clientX;
        if (newWidth > 160 && newWidth < 500) {
          setSidebarWidth(newWidth);
        }
      }
      
      if (isDraggingTerminal) {
        const { height } = terminalRef.current.getBoundingClientRect();
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 100 && newHeight < 500) {
          setTerminalHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
      setIsDraggingTerminal(false);
    };

    if (isDraggingSidebar || isDraggingTerminal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar, isDraggingTerminal]);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-gray-300 overflow-hidden select-none">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className="flex flex-col bg-[#252526] border-r border-[#1e1e1e]"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Explorer header */}
          <div className="flex items-center h-8 bg-[#252526] border-b border-[#1e1e1e] text-xs text-gray-300 font-medium px-3">
            <span className="uppercase tracking-wider">EXPLORER</span>
            <div className="flex-1"></div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white p-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white p-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white p-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* FileTree component */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3d41] scrollbar-track-[#252526]">
            <FileTree onSelect={(path) => {
              console.log(path);
              setSelectedFile(path)
            }}/>
          </div>
        </div>
        
        {/* Sidebar resize handle */}
        <div 
          className="w-1 bg-transparent hover:bg-[#007acc] cursor-col-resize z-10 transition-colors"
          onMouseDown={() => setIsDraggingSidebar(true)}
        ></div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Editor tabs */}
          <div className="flex items-center h-8 bg-[#252526] border-b border-[#1e1e1e]">
            {selectedFile && (
              <div className="flex items-center h-full px-3 bg-[#1e1e1e] border-r border-[#1e1e1e]">
                <span className="text-xs text-gray-300">{selectedFile.split('/').pop()}</span>
              </div>
            )}
          </div>
          
          {/* Breadcrumb path */}
          <div className="bg-[#252526] px-3 py-1 text-xs text-[#569cd6] border-b border-[#1e1e1e]">
            {selectedFile ? selectedFile.replaceAll("/", " > ") : "Welcome"}
          </div>
          
          {/* Editor with VS Code logo or content */}
          <div className="flex-1 overflow-hidden relative">
            {selectedFile ? (
              <Editor selectedFile={selectedFile} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg className="w-64 h-64 text-[#3a3d41]" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M75.7,50.4L99,34.2l-23.3-4v-12L30.1,1.4L0.8,18.2v64.4l29.3,16.6l45.5-16.4l23.3-11.4V17.2L75.7,50.4z M30.1,83.4L8.8,70.8V28.8l21.3,9.4V83.4z M30.1,31.4L9.6,22.5l20.5-11L70.3,25L30.1,31.4z M91.5,67.8L76.5,75V36.7l-37.8,15v31.8l-1.7,0.6l-0.1-0.3V39.7L91.5,23V67.8z"/>
                </svg>
              </div>
            )}
          </div>
          
          {/* Terminal resize handle */}
          <div 
            className="h-1 bg-transparent hover:bg-[#007acc] cursor-row-resize z-10 transition-colors"
            onMouseDown={() => setIsDraggingTerminal(true)}
          ></div>
          
          {/* Terminal panel */}
          <div 
            ref={terminalRef}
            className="bg-[#1e1e1e] border-t border-[#007acc] flex flex-col"
            style={{ height: `${terminalHeight}px` }}
          >
            {/* Terminal tabs */}
            <div className="flex text-xs h-8 bg-[#252526] border-b border-[#1e1e1e]">
              <div className="flex items-center px-3 h-full bg-[#1e1e1e] text-white border-r border-[#1e1e1e]">
                TERMINAL
              </div>
              <div className="flex-1"></div>
              <div className="flex items-center px-2">
                <button className="text-gray-400 hover:text-white p-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 2a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1V3a1 1 0 0 1 1-1h6z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white p-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Terminal content with fixed scrollbar */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3d41] scrollbar-track-[#1e1e1e] p-2">
              <Terminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App