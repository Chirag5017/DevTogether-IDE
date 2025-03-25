import path from "path"
import fs from "fs"


const generateFileTree = async (directory) => {
    const tree = {};
  
    async function fileTree(directory, currentTree) {
  
      const files = fs.readdir(directory);
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.stat(filePath);
  
        if (stat.isDirectory()) {
          currentTree = {};
          await fileTree(filePath, currentTree[file]);
        } else {
          currentTree = null;
        }
      }
    }
    await fileTree(directory, tree);
    return tree;
  };

  export { generateFileTree }
  