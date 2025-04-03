import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket.js";


// nodes for checking weather the file is a directory or not null means file 
const FileTreeNode = ({  treeName , nodes, path, setSelectedFolder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDir = !! nodes

  const handleToggle = () => {
   if(isDir) {
    setIsOpen(!isOpen)
   }
  }

    return (
      <div className={"ml-3"}>
        <div onClick = {(e) => {
          e.stopPropagation()
          handleToggle() // open and close the folders
        }} className= {"cursor-pointer"}> {treeName} </div>
        { isOpen && nodes && (
          <ul>
            {Object.keys(nodes).map((child) => (
              <li key={child}>
                <FileTreeNode treeName={child} nodes={nodes[child]} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  const FileTree = () => {
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
    return <FileTreeNode  
             treeName="/"  
             nodes={fileTree}
             path=""
             setSelectedFolder={setSelectedFolder}
          />;
  };
  export default FileTree;