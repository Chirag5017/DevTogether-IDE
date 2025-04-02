import { useEffect, useState } from "react";
import axios from "axios";

const FileTreeNode = ({  fileName , nodes }) => {
    return (
      <div style={{ marginLeft: "10px" }}>
        <p>{fileName}</p>
        {nodes && (
          <ul>
            {Object.keys(nodes).map((child) => (
              <li key={child}>
                <FileTreeNode
                  fileName={child}
                  nodes={nodes[child]}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  const FileTree = () => {
     const [fileTree, setFileTree] = useState({})
      const getFileTree = async () => {
        const response = await axios.get("http://localhost:9000/api/file-path");
        const data = await response.data
        setFileTree(data.tree)
      }
      useEffect(() => {
        getFileTree();
      },[])
    return <FileTreeNode  fileName="/"  nodes={fileTree} />;
  };
  export default FileTree;