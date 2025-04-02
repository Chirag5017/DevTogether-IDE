import React, { useEffect, useRef } from 'react'
import { Terminal as Xterminal } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"

const Terminal = () => {
    const terminalRef = useRef()

    useEffect(() => {
        const term = new Xterminal({
            rows:20,
        })

        term.open(terminalRef.current) // open terminal in the div

        term.onData((data) => {
           console.log(data);   // user write on terminal
        })

    }, [])
  return ( 
    <div ref={terminalRef} />
  )
}

export default Terminal