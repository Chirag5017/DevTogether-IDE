import FileTree from './components/FileTree'
import Terminal from './components/Terminal'


const App = () => {
 
  return (
    <div className = {"flex flex-col"  }>
    <div className = {"h-[54vh]"}>
     <div>
      <FileTree />
      </div>
     <div></div>
    </div>
    <div>
      <Terminal />
    </div>
    </div>
  )
}

export default App