import React, { useState, useEffect } from 'react'
import Terminal from './Terminal'

const TerminalManager = ({ terminalHeight }) => {
    const [terminals, setTerminals] = useState([])
    const [activeTerminal, setActiveTerminal] = useState(null)

    useEffect(() => {
        // Create initial terminal
        const initialTerminal = {
            id: `terminal-${Date.now()}`,
            name: 'Terminal 1'
        }
        setTerminals([initialTerminal])
        setActiveTerminal(initialTerminal.id)
    }, [])

    const addTerminal = () => {
        const newTerminal = {
            id: `terminal-${Date.now()}`,
            name: `Terminal ${terminals.length + 1}`
        }
        setTerminals(prev => [...prev, newTerminal])
        setActiveTerminal(newTerminal.id)
    }

    const removeTerminal = (id) => {
        if (terminals.length <= 1) return
        
        setTerminals(prev => {
            const newTerminals = prev.filter(term => term.id !== id)
            if (activeTerminal === id) {
                setActiveTerminal(newTerminals[0].id)
            }
            return newTerminals
        })
    }

    return (
        <div className="flex flex-col h-full bg-[#121212]">
            <div className="flex text-xs h-8 bg-[#252525] border-b border-[#333333]">
                {terminals.map(term => (
                    <div
                        key={term.id}
                        className={`flex items-center px-4 h-full cursor-pointer ${
                            activeTerminal === term.id
                                ? 'bg-[#121212] border-t-2 border-[#ffffff] text-[#ffffff]' 
                                : 'text-[#aaaaaa] hover:text-[#ffffff]'
                        }`}
                        onClick={() => setActiveTerminal(term.id)}
                    >
                        {term.name}
                        {terminals.length > 1 && (
                            <button
                                className="ml-2 text-[#aaaaaa] hover:text-[#ffffff]"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeTerminal(term.id)
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    className="flex items-center px-2 text-[#aaaaaa] hover:text-[#ffffff]"
                    onClick={addTerminal}
                    title="Add Terminal"
                >
                    +
                </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {terminals.map(term => (
                    <div
                        key={term.id}
                        className={`absolute inset-0 ${activeTerminal === term.id ? 'block' : 'hidden'}`}
                    >
                        <Terminal terminalId={term.id} height={terminalHeight} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TerminalManager