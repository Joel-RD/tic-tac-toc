import { RenderBoard } from "../../componets/Board"

export function Home() {
    return (
       <h1>Inicio</h1>
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
    <script src="/socket.io/socket.io.js"></script>
    return (
         <div className="game-view">
            <span className="loader"></span>
            <RenderBoard />
        </div>
    )
}