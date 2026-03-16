import { useState } from "react"
import { RenderBoard } from "../../componets/Board"
import { Lobby } from "../../componets/Lobby"
import { SocketBoard } from "../../componets/SocketBoard"

export function Home() {
    return (
        <div className="home_link">
            <a href="/solo" className="nav-link">Un jugador</a>
            <a href="/multiplayer" className="nav-link">Multijugador</a>
        </div>
    )
}

export function SinglePlayer() {
    return (
        <div className="game-view">
            <span className="loader"></span>
            <RenderBoard />
        </div>
    )
}

export function MultiPlayer() {
    const [gameState, setGameState] = useState<{ room: any, symbol: string } | null>(null)

    if (!gameState) {
        return <Lobby onJoinRoom={(room, symbol) => setGameState({ room, symbol })} />
    }

    return (
        <div className="game-view">
            <h2>Sala: {gameState.room.name}</h2>
            <SocketBoard roomId={gameState.room.id} playerSymbol={gameState.symbol} />
        </div>
    )
}