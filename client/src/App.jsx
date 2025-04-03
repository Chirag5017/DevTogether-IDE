import FileTree from './components/FileTree'
import Terminal from './components/Terminal'


const App = () => {
 
  return (
    <div className = {"playground-container flex flex-col"  }>
    <div className = {"editor-container h-[54vh]"}>
     <div className={"files"}>
      <FileTree />
      </div>
     <div className={"editor"}></div>
    </div>
    <div className={"terminal-container"}>
      <Terminal />
    </div>
    </div>
  )
}

export default App