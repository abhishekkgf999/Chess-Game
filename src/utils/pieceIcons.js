import {
    FaChessKing,
    FaChessQueen,
    FaChessRook,
    FaChessBishop,
    FaChessKnight,
    FaChessPawn,
} from "react-icons/fa";

export const pieceIcons = {
    k: (color, animation, ref) => (
        <FaChessKing
            ref={ref}
            className={`text-3xl md:text-4xl lg:text-5xl drop-shadow-lg ${color} ${animation}`}
        />
    ),
    q: (color, animation, ref) => (
        <FaChessQueen
            ref={ref}
            className={`text-3xl md:text-4xl lg:text-5xl drop-shadow-lg ${color} ${animation}`}
        />
    ),
    r: (color, animation, ref) => (
        <FaChessRook
            ref={ref}
            className={`text-3xl md:text-4xl lg:text-5xl drop-shadow-lg ${color} ${animation}`}
        />
    ),
    b: (color, animation, ref) => (
        <FaChessBishop
            ref={ref}
            className={`text-3xl md:text-4xl lg:text-5xl drop-shadow-lg ${color} ${animation}`}
        />
    ),
    n: (color, animation, ref) => (
        <FaChessKnight
            ref={ref}
            className={`text-3xl md:text-4xl lg:text-5xl drop-shadow-lg ${color} ${animation}`}
        />
    ),
    p: (color, animation, ref) => (
        <FaChessPawn
            ref={ref}
            className={`text-3xl md:text-4xl lg:text-5xl drop-shadow-lg ${color} ${animation}`}
        />
    ),
};
