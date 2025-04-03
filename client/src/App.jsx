import { useState, useRef, useEffect } from 'react'
import FileTree from './components/FileTree'
import Terminal from './components/Terminal'
import Editor from './components/Editor.jsx'
import socket from './socket.js'

const App = () => {
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("")
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [terminalHeight, setTerminalHeight] = useState(180)
  const sidebarRef = useRef(null)
  const terminalRef = useRef(null)
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false)

  const addFile = () => {
    const fileName = prompt("Enter file name (with extension):")
    if (fileName) {
      const filePath = selectedFolder ? `${selectedFolder}/${fileName}` : fileName
      socket.emit("file:create", { path: filePath, type: "file" })
    }
  }

  const addFolder = () => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      const folderPath = selectedFolder ? `${selectedFolder}/${folderName}` : folderName
      socket.emit("file:create", { path: folderPath, type: "folder" })
    }
  }
  
  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingSidebar) {
        const newWidth = e.clientX
        if (newWidth > 160 && newWidth < 500) {
          setSidebarWidth(newWidth)
        }
      }
      
      if (isDraggingTerminal) {
        const newHeight = window.innerHeight - e.clientY
        if (newHeight > 100 && newHeight < 500) {
          setTerminalHeight(newHeight)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDraggingSidebar(false)
      setIsDraggingTerminal(false)
    }

    if (isDraggingSidebar || isDraggingTerminal) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingSidebar, isDraggingTerminal])

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-[#e0e0e0] overflow-hidden select-none font-[consolas,'Courier New',monospace] cursor-default">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className="flex flex-col bg-[#1e1e1e] border-r border-[#333333]"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Explorer header */}
          <div className="flex items-center h-8 bg-[#252525] border-b border-[#333333] text-xs text-[#ffffff] font-medium h-11 px-4">
           <div className="p-1"> <span className="uppercase tracking-wider">EXPLORER</span></div>
            <div className="flex-1"></div>
            <div className="flex space-x-2">
              <button 
                onClick={addFile}
                className="text-[#aaaaaa] hover:text-white p-1 hover:bg-[#333333] rounded-md border border-transparent hover:border-[#ffffff] transition-all"
                title="New File"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              
              <button 
                onClick={addFolder}
                className="text-[#aaaaaa] hover:text-white p-1 hover:bg-[#333333] rounded-md border border-transparent hover:border-[#ffffff] transition-all"
                title="New Folder"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* FileTree */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#444444] scrollbar-track-[#252525] p-1">
            <FileTree 
              onSelect={(path) => setSelectedFile(path)}
              setSelectedFolder={setSelectedFolder}
              selectedFile={selectedFile}
            />
          </div>
        </div>
        
        {/* Resize handle */}
        <div 
          className="w-1 bg-[#121212] hover:bg-[#ffffff] cursor-col-resize transition-all"
          onMouseDown={() => setIsDraggingSidebar(true)}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#121212]">
          {/* Editor tabs - only shown when file is selected */}
          {selectedFile && (
            <div className="flex items-center h-8 bg-[#252525] border-b border-[#333333]">
              <div className="flex items-center h-full px-4 bg-[#121212] border-t-2 border-[#ffffff] text-[#ffffff]">
                <span className="text-xs">{selectedFile.split('/').pop()}</span>
              </div>
            </div>
          )}
          
          {/* Modified Breadcrumb */}
          <div className="bg-[#252525] px-4 py-1 text-xs border-b border-[#333333]">
            {selectedFile ? (
              <span className="text-[#ffffff]">{selectedFile.replaceAll("/", " > ")}</span>
            ) : (
              <div className="flex justify-center">
                <span className="text-[#ffffff] p-1 tracking-wider font-medium text-lg">Welcome to DevTogether</span>
              </div>
            )}
          </div>
          
          {/* Editor area */}
          <div className="flex-1 overflow-hidden relative bg-[#121212]">
            {selectedFile ? (
              <Editor selectedFile={selectedFile} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                  <svg 
                    className="w-32 h-32 mx-auto text-[#333333]" 
                    viewBox="0 0 100 100" 
                    fill="currentColor"
                  >
                    <path d="M75.7,50.4L99,34.2l-23.3-4v-12L30.1,1.4L0.8,18.2v64.4l29.3,16.6l45.5-16.4l23.3-11.4V17.2L75.7,50.4z M30.1,83.4L8.8,70.8V28.8l21.3,9.4V83.4z M30.1,31.4L9.6,22.5l20.5-11L70.3,25L30.1,31.4z M91.5,67.8L76.5,75V36.7l-37.8,15v31.8l-1.7,0.6l-0.1-0.3V39.7L91.5,23V67.8z"/>
                  </svg>
                  <h1 className="mt-6 text-[#ffffff] text-2xl font-medium">DevTogether IDE</h1>
                  <p className="text-[#aaaaaa] text-base mt-3">
                    Select a file from the sidebar or create a new one to begin editing
                  </p>
                  <div className="mt-6 flex justify-center space-x-4">
                    <button 
                      onClick={addFile}
                      className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-md border border-[#555555] transition-all"
                    >
                      New File
                    </button>
                    <button 
                      onClick={addFolder}
                      className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-md border border-[#555555] transition-all"
                    >
                      New Folder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Terminal resize handle */}
          <div 
            className="h-1 bg-[#121212] hover:bg-[#ffffff] cursor-row-resize transition-all"
            onMouseDown={() => setIsDraggingTerminal(true)}
          />
          
          {/* Terminal panel */}
          <div 
            ref={terminalRef}
            className="bg-[#121212] border-t border-[#333333] flex flex-col"
            style={{ height: `${terminalHeight}px` }}
          >
            <div className="flex text-xs h-8 bg-[#252525] border-b border-[#333333]">
              <div className="flex items-center px-4 h-full bg-[#121212] border-t-2 border-[#ffffff] text-[#ffffff]">
                TERMINAL
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#444444] scrollbar-track-[#252525] p-3 font-mono text-sm bg-[#121212]">
              <Terminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App