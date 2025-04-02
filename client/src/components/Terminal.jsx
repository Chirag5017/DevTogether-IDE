import React, { useEffect, useRef, useState } from 'react'
import { Terminal as Xterminal } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"
import socket from "../socket.js"

const Terminal = () => {
    const terminalRef = useRef()
    const [isRendered, setIsRendered] = useState(false)

    useEffect(() => {
        if(isRendered) return
        setIsRendered(true)
        const term = new Xterminal({
            rows:20,
        })

        term.open(terminalRef.current) // open terminal in the div
        

        term.onData((data) => {
            socket.emit("terminal:write", data)
        })

        socket.on("terminal:data", (data) => {
            term.write(data)   // write in the terminal
        })

    }, [])
  return ( 
    <div ref={terminalRef} />
  )
}

export default Terminal