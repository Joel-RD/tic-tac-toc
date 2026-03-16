import { useState, useEffect } from "react"
import { drawWinner } from "../utils/checkWinner"
import "./board.css"

type Position = { _index: number; turn: string };

const createButtons = ({ countBoard, className, handleClick }: { countBoard: number[], className: string, handleClick: (index: number) => void }) => {
   return countBoard.map((_, index) => {
      return (
         <aside key={index}>
            <button
               className={className + `${index}`}
               onClick={() => handleClick(index)}
            >
            </button>
         </aside>
      )
   })
}

export const RenderBoard = () => {
   const [turn, setTurn] = useState("X")
   let [positionX, setPositionX] = useState<Position[]>([]);
   let [positionO, setPositionO] = useState<Position[]>([]);

   // CALCULO DERIVADO: Calculamos el ganador directamente durante el renderizado.
   // Esto es seguro en React porque no dispara una nueva actualización de estado.
   const winner = drawWinner({ positionX, positionO })

   // EFECTO SECUNDARIO: Usamos useEffect para manejar el temporizador y la manipulación del DOM.
   // useEffect solo se ejecuta DESPUÉS de que el componente se ha dibujado en pantalla.
   useEffect(() => {
      if (winner) {
         const loader = document.getElementsByClassName('loader')[0] as HTMLElement;
         if (loader) loader.style.display = 'block';

         const timer = setTimeout(() => {
            window.location.reload()
         }, 5000)

         // Limpiamos el temporizador si el componente se desmonta
         return () => clearTimeout(timer);
      }
   }, [winner]);

   const handleClick = (_index: number) => {
      // Si ya hay un ganador, no permitimos más clics
      if (winner) return;

      setTurn(turn === "O" ? "X" : "O")
      const allButtons = document.getElementsByTagName('button')
      const buttonPosition = allButtons[_index]

      buttonPosition.innerText = turn
      buttonPosition.disabled = true
      buttonPosition.classList.add(turn === "X" ? "x-mark" : "o-mark");

      if (turn === "X") {
         setPositionX([...positionX, { _index, turn }])
      } else {
         setPositionO([...positionO, { _index, turn }])
      }
   }

   const countBoard = Array(9).fill(null)
   const className = 'button'

   return (
      <>
         <section className="board">
            {createButtons({ countBoard, className, handleClick })}
         </section >
         <section className="turn">
            <p>Turn</p>
            <p>
               {turn}
            </p>
            <p>
               {winner === "Empate" ? "Empate." : winner ? `El ganador es ${winner}` : "Juego en curso..."}
            </p>
         </section>
         <section>
         </section>
      </>
   )
}