import React, { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react';
import socket from '../socket';
import axios from 'axios'
import { getFileExtension } from '../utils/getFileExtension';

const Editor = ({selectedFile}) => {
  const [code, setCode] = useState("")
    const [fileContent, setFileContent] = useState("")
  
    const getFileContent = async () => {
        const response = await axios.get(`http://localhost:9000/api/file-content?path=${selectedFile}`)
        const data = await response.data;
        setFileContent(data.content)
    }
  
    useEffect(() => {   // when someone write on code editor for saving the code writen in file
      if(code) {
        const timer = setTimeout(() => {
          console.log("code", code)
          socket.emit("file:change",{
            path: selectedFile,
            content: code
          })
        }, 1*1000);
  
        return () => clearTimeout(timer)
      }
    }, [code,selectedFile])
    
    useEffect(() => {  // when file is selected from file tree all content of the file is fetched
      if(selectedFile) {
        getFileContent()
      }
    },[selectedFile])
  
    useEffect(() => {  // when file content is fetched from backend it is set in the code editor
      setCode(fileContent)
    },[fileContent])
  
  return (
    <MonacoEditor 
     language={getFileExtension({ selectedFile })}
     theme='vs-dark' 
     value={code} 
     onChange={(e) => setCode(e)} 
     />
  )
}

export default Editor