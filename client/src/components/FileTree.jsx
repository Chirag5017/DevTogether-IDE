import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket.js";


// nodes for checking weather the file is a directory or not null means file 
const FileTreeNode = ({  treeName , nodes, path, setSelectedFolder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDir = !! nodes

  const handleToggle = () => {
   if(isDir) {
    setIsOpen(!isOpen)  // open and close the folders
    setSelectedFolder(path); // set the selected folder for adding files and folders
   }
   else {
    onSelect(path); // select the file for opening in editor
   }
  }

    return (
      <div className={"ml-3"}>
        <div onClick = {(e) => {
          e.stopPropagation()
          handleToggle() // open and close the folders
        }} className= {"cursor-pointer"}> 
          {treeName != "FILE BOX" ? (isDir ? (isOpen ? "📂" : "📁") : "📄") : ""}
         {treeName} 
         </div>
        { isOpen && nodes && (
          <ul>
            {Object.keys(nodes).map((child) => (
              <li key={child}>
                <FileTreeNode 
                treeName={child} 
                nodes={nodes[child]} 
                onSelect={onSelect} 
                path={path + "/" + child} 
                setSelectedFolder={setSelectedFolder} />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  
  const FileTree = ({onSelect}) => {
     const [fileTree, setFileTree] = useState({})
     const [selectedFolder, setSelectedFolder] = useState("")

      const getFileTree = async () => {
        const response = await axios.get("http://localhost:9000/api/file-path");
        const data = await response.data
        setFileTree(data.tree)
      }
      useEffect(() => {
        getFileTree();
      },[])
      socket.on("file:refresh", getFileTree())

      const addFile = () => {
        const fileName = prompt("Enter file name (with extension):");
        
        
        if (fileName) {
          const filePath = selectedFolder ? `${selectedFolder}/${fileName}` : fileName;
          console.log(selectedFolder);
          
          console.log(filePath);
          
          socket.emit("file:create", { path: filePath, type: "file" });
        }
      }
    
      const addFolder = () => {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
          const folderPath = selectedFolder ? `${selectedFolder}/${folderName}` : folderName;
          socket.emit("file:create", { path: folderPath, type: "folder" });
        }
      }
    return (
      <div>
         <button onClick={addFile}>➕ Add File</button>
         <button onClick={addFolder}>📁 Add Folder</button>
        <FileTreeNode  
             treeName="FILE BOX"  
             nodes={fileTree}
             path=""
             setSelectedFolder={setSelectedFolder}
             onSelect={onSelect}
          />
      </div>
    )
  }
  export default FileTree;