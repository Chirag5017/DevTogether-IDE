import React, { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import socket from '../socket';
import axios from 'axios';
import { getFileExtension } from '../utils/getFileExtension';

const Editor = ({ selectedFile, roomId }) => {
  const [code, setCode] = useState("");
  const [fileContent, setFileContent] = useState("");

  const getFileContent = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/file-content?path=${selectedFile}`);
      setFileContent(response.data.content);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  useEffect(() => {
    // Load file content when selected file changes
    if (selectedFile) {
      getFileContent();
    }
  }, [selectedFile]);

  useEffect(() => {
    // Update editor content when file content is fetched
    setCode(fileContent);
  }, [fileContent]);

  useEffect(() => {
    // Handle remote changes
    const handleRemoteChange = ({ path, content }) => {
      if (path === selectedFile) {
        setCode(content);
      }
    };

    socket.on('file:change', handleRemoteChange);
    return () => socket.off('file:change', handleRemoteChange);
  }, [selectedFile]);

  const handleChange = (newValue) => {
    setCode(newValue);
    // Broadcast changes to room
    socket.emit('file:change', {
      path: selectedFile,
      content: newValue,
      roomId
    });
  };

  return (
    <MonacoEditor 
      language={getFileExtension({ selectedFile })}
      theme='vs-dark' 
      value={code} 
      onChange={handleChange}
    />
  );
};

export default Editor;