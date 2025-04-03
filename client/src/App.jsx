import FileTree from './components/FileTree'
import Terminal from './components/Terminal'
import { useState } from 'react'
import  Editor  from './components/Editor.jsx'


const App = () => {

   const [selectedFile, setSelectedFile] = useState("")
     return (
     <div className = {"playground-container flex flex-col"  }>
     <div className = {"editor-container h-[54vh]"}>
     <div className={"files"}>
      <FileTree  onSelect= {(path) => {  // storing comming path from fileTree
        console.log(path);
        setSelectedFile(path)
      }}/>
      </div>
      <div className={"editor"}>
      <p>{selectedFile.replaceAll("/", "> ")}</p>
      <Editor
       selectedFile={selectedFile}
      />
      </div>
     </div>
     <div className={"terminal-container"}>
      <Terminal />
     </div>
     </div>
  )
}

export default App