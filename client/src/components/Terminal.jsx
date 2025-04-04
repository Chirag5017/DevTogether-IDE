import React, { useEffect, useRef, useState } from 'react'
import { Terminal as Xterminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit'
import "@xterm/xterm/css/xterm.css"
import socket from "../socket.js"

const Terminal = ({terminalId,height}) => {
    
    const terminalRef = useRef()
    const [terminal, setTerminal] = useState(null)
    const fitAddon = new FitAddon()

    useEffect(() => {
        console.log(terminalId);
        const term = new Xterminal({
            fontSize: 14,
            fontFamily: 'Consolas, "Courier New", monospace',
            theme: {
                background: '#121212',
                foreground: '#e0e0e0',
                cursor: '#e0e0e0',
                selection: 'rgba(255, 255, 255, 0.3)',
            },
            scrollback: 1000,
            allowTransparency: true,
        })

        term.loadAddon(fitAddon)
        term.open(terminalRef.current)
        fitAddon.fit()
        setTerminal(term)

        socket.emit("terminal:create", terminalId)
        term.onData((data) => {
           // console.log( terminalId, data)
            socket.emit("terminal:write", { terminalId, data })
        })

        // Handle terminal output
       
         socket.on("terminal:data", ({id, output}) => {
            if (id == terminalId) {
                term.write(output)
            }
         })


        const handleResize = () => {
            fitAddon.fit()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            term.dispose()
        }
    }, [])

    return (
        <div 
        ref={terminalRef} 
        className="h-full w-full p-2"
        style={{ height: `calc(${height}px - 2rem)` }}
    />
    )
}

export default Terminal