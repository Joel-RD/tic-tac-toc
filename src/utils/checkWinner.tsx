type Position = { _index: number; turn: string };

const winPatterns: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const checkWinner = ({ setElements }: { setElements: Position[] }): boolean => {
    return winPatterns.some(pattern =>
        pattern.every(pos =>
            setElements.some(p => p._index === pos)
        )
    );
}

export const drawWinner = ({ positionX, positionO }: { positionX: Position[], positionO: Position[] }) => {
    if (checkWinner({ setElements: positionX })) {
        return "X"
    }

    if (checkWinner({ setElements: positionO })) {
        return "O"
    }

    if (positionX.length + positionO.length === 9) {
        return "Empate"
    }

    return null
}

