import React, { useEffect, useRef, useState } from 'react'
import { Terminal as Xterminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit'
import "@xterm/xterm/css/xterm.css"
import socket from "../socket.js"

const Terminal = () => {
    const terminalRef = useRef()
    const [terminal, setTerminal] = useState(null)
    const fitAddon = new FitAddon()

    useEffect(() => {
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

        term.onData((data) => {
            socket.emit("terminal:write", data)
        })

        socket.on("terminal:data", (data) => {
            term.write(data)
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
        <div className="h-full w-full p-2">
            <div 
                ref={terminalRef} 
                className="h-full w-full rounded-md overflow-hidden"
            />
        </div>
    )
}

export default Terminal