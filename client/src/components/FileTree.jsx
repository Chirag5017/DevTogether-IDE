import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket.js";

const FileTreeNode = ({ treeName, nodes, path, setSelectedFolder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDir = !!nodes;

  const handleToggle = () => {
    if (isDir) {
      setIsOpen(!isOpen);
      setSelectedFolder(path);
    } else {
      onSelect(path);
    }
  };

  return (
    <div className={"ml-3"}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={"cursor-pointer"}
      >
        {treeName != "File Box" ? (isDir ? (isOpen ? "📂" : "📁") : "📄") : ""}
        <span className={"inline tracking-wider"}> {treeName} </span>
      </div>
      {isOpen && nodes && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                treeName={child}
                nodes={nodes[child]}
                onSelect={onSelect}
                path={path + "/" + child}
                setSelectedFolder={setSelectedFolder}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = ({ onSelect, setSelectedFolder }) => {
  const [fileTree, setFileTree] = useState({});

  const getFileTree = async () => {
    const response = await axios.get("http://localhost:9000/api/file-path");
    const data = await response.data;
    setFileTree(data.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);

  socket.on("file:refresh", getFileTree());

  return (
    <FileTreeNode
      treeName="File Box"
      nodes={fileTree}
      path=""
      setSelectedFolder={setSelectedFolder}
      onSelect={onSelect}
    />
  );
};

export default FileTree;