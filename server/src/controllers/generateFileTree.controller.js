import path from "path"
import fs from "fs/promises"


const generateFileTree = async (directory) => {
    const tree = {};
  
    async function fileTree(directory, currentTree) {
  
      const files = await fs.readdir(directory);
      //console.log(files);
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        ///console.log(filePath);
        
  
        if (stat.isDirectory()) {
          currentTree[file] = {};
          await fileTree(filePath, currentTree[file]);
        } else {
          currentTree[file] = null;
        }
      }
    }
    await fileTree(directory, tree);
    return tree;
  };

  export { generateFileTree }
  