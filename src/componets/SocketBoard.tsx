import { useState, useEffect } from "react"
import { socket } from "../utils/socket"
import "./board.css"

// type Player = { id: string, name: string, symbol: string };
// type Room = { id: string, name: string, players: Player[], board: string[], turn: string, status: string };

export const SocketBoard = ({ roomId, playerSymbol }: { roomId: string, playerSymbol: string }) => {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
    const [turn, setTurn] = useState("X")
    const [winner, setWinner] = useState<string | null>(null)

    useEffect(() => {
        socket.on('move_made', ({ board, turn }) => {
            setBoard(board)
            setTurn(turn)
        })

        socket.on('player_disconnected', () => {
            alert('El otro jugador se ha desconectado.')
            window.location.reload()
        })

        return () => {
            socket.off('move_made')
            socket.off('player_disconnected')
        }
    }, [])

    const handleClick = (index: number) => {
        if (board[index] || turn !== playerSymbol || winner) return

        socket.emit('make_move', { roomId, index, symbol: playerSymbol })
    }

    // Lógica simple para detectar ganador localmente (para visualización)
    useEffect(() => {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        for (let i = 0; i < winningLines.length; i++) {
            const [a, b, c] = winningLines[i]
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a])
                return
            }
        }
        if (!board.includes(null)) {
            setWinner("Empate")
        }
    }, [board])

    return (
        <div className="game-view">
            <section className="board">
                {board.map((cell, index) => (
                    <aside key={index}>
                        <button
                            className={`button${index} ${cell === 'X' ? 'x-mark' : cell === 'O' ? 'o-mark' : ''}`}
                            onClick={() => handleClick(index)}
                            disabled={!!cell || turn !== playerSymbol}
                        >
                            {cell}
                        </button>
                    </aside>
                ))}
            </section>
            <section className="turn">
                <p>Tu eres: <strong>{playerSymbol}</strong></p>
                <p>Turno de: <strong>{turn}</strong></p>
                <p>
                    {winner === "Empate" ? "¡Empate!" : winner ? `¡Ganador: ${winner}!` : (turn === playerSymbol ? "Es tu turno" : "Esperando al oponente...")}
                </p>
            </section>
        </div>
    )
}
