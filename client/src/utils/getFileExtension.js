export const getFileExtension = ({ selectedFile }) => {
    const splitedArray = selectedFile.split(".");
    
    const extension = splitedArray[splitedArray.length - 1];
  
    switch (extension) {
      case "js":
        return "javascript";
      case "py":
        return "python";
      case "java":
        return "java";
      case "xml":
        return "xml";
      case "rb":
        return "ruby";
      case "sass":
        return "sass";
      case "md":
        return "markdown";
      case "sql":
        return "mysql";
      case "json":
        return "json";
      case "html":
        return "html";
      case "hbs":
        return "handlebars";
      case "handlebars":
        return "handlebars";
      case "go":
        return "golang";
      case "cs":
        return "csharp";
      case "litcoffee":
        return "coffee";
      case "css":
        return "css";
      case "txt":
        return "txt"
      case "jsx":
        return "jsx"
      case "ts":
        return "typescript"
      case "tsx":
        return "typescript"
      case "php":
        return "php"
      case "sh":
        return "bash"
      case "bash":
        return "bash"
      case "yaml":
        return "yaml"
      case "yml":
        return "yaml"
      case "dockerfile":
        return "dockerfile"
      case "docker":
        return "dockerfile"
      case "env":
        return "env"

      default:
        return "txt";
    }
  };