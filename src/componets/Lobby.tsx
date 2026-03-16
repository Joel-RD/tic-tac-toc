import { useState, useEffect } from "react"
import { socket, connectSocket } from "../utils/socket"

type Player = { id: string, name: string, symbol: string };
type Room = { id: string, name: string, players: Player[], board: string[], turn: string, status: string };

export const Lobby = ({ onJoinRoom }: { onJoinRoom: (room: Room, symbol: string) => void }) => {
    const [rooms, setRooms] = useState<Room[]>([])
    const [newRoomName, setNewRoomName] = useState("")

    useEffect(() => {
        connectSocket()

        socket.emit('get_rooms')

        socket.on('rooms_list', (roomsList: Room[]) => {
            setRooms(roomsList)
        })

        socket.on('room_created', (room: Room) => {
            onJoinRoom(room, 'X')
        })

        socket.on('joined_room', (room: Room) => {
            onJoinRoom(room, 'O')
        })

        return () => {
            socket.off('rooms_list')
            socket.off('room_created')
            socket.off('joined_room')
        }
    }, [onJoinRoom])

    const handleCreateRoom = () => {
        if (!newRoomName.trim()) return
        socket.emit('create_room', newRoomName)
    }

    const handleJoinRoom = (roomId: string) => {
        socket.emit('join_room', roomId)
    }

    return (
        <div className="lobby">
            <h2>Lobby Multiplayer</h2>
            <div className="create-room">
                <input 
                    type="text" 
                    placeholder="Nombre de la sala..." 
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                />
                <button onClick={handleCreateRoom}>Crear Sala</button>
            </div>
            
            <div className="rooms-list">
                <h3>Salas Disponibles</h3>
                {rooms.length === 0 ? (
                    <p>No hay salas activas. ¡Crea una!</p>
                ) : (
                    rooms.map(room => (
                        <div key={room.id} className="room-item">
                            <span>{room.name} ({room.players.length}/2)</span>
                            <button 
                                onClick={() => handleJoinRoom(room.id)}
                                disabled={room.players.length >= 2}
                            >
                                {room.players.length >= 2 ? "Llena" : "Unirse"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
