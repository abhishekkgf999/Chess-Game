"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import {
    FaChessKing,
    FaChessQueen,
    FaChessRook,
    FaChessBishop,
    FaChessKnight,
    FaChessPawn,
} from "react-icons/fa";
import clsx from "clsx";
import ChessPreloader from "@/components/preload/chess-preloader";

const pieceIcons = {
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

export default function ChessGame() {
    // Game state
    const [isLoading, setIsLoading] = useState(true);
    const [game, setGame] = useState(null);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
    const [currentPlayer, setCurrentPlayer] = useState("w");
    const [timers, setTimers] = useState({ w: 300, b: 300 });
    const [winner, setWinner] = useState(null);
    const [lastMove, setLastMove] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Create refs for all squares
    const squareRefs = useRef([]);

    // Initialize refs and game
    useEffect(() => {
        // Initialize square refs
        squareRefs.current = Array(64)
            .fill()
            .map((_, i) => squareRefs.current[i] || React.createRef());

        // Initialize game after delay
        const timer = setTimeout(() => {
            setGame(new Chess());
            setCurrentPlayer("w");
            setIsLoading(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    // Handle piece movement animations
    useEffect(() => {
        if (!game || !lastMove) return;

        const toSquare = lastMove.to;
        const fromSquare = lastMove.from;

        const toFile = toSquare.charCodeAt(0) - 97;
        const toRank = 8 - parseInt(toSquare[1]);
        const toIndex = toRank * 8 + toFile;

        const fromFile = fromSquare.charCodeAt(0) - 97;
        const fromRank = 8 - parseInt(fromSquare[1]);
        const fromIndex = fromRank * 8 + fromFile;

        if (squareRefs.current[toIndex]?.current) {
            const dx = (fromFile - toFile) * 100;
            const dy = (fromRank - toRank) * 100;

            squareRefs.current[toIndex].current.animate(
                [
                    { transform: `translate(${dx}%, ${dy}%)`, opacity: 0.8 },
                    { transform: "translate(0, 0)", opacity: 1 },
                ],
                {
                    duration: 300,
                    easing: "ease-out",
                    fill: "forwards",
                }
            );
        }
    }, [lastMove, game]);

    // Timer effect
    useEffect(() => {
        if (winner || isLoading) return;
        const timer = setInterval(() => {
            setTimers((prev) => ({
                ...prev,
                [currentPlayer]: Math.max(0, prev[currentPlayer] - 1),
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentPlayer, winner, isLoading]);

    // Check game status
    useEffect(() => {
        if (!game || isLoading) return;

        if (game.isCheckmate()) {
            setWinner(currentPlayer === "w" ? "Black" : "White");
        } else if (game.isDraw()) {
            setWinner("Draw");
        } else if (timers.w === 0) {
            setWinner("Black");
        } else if (timers.b === 0) {
            setWinner("White");
        }
    }, [game, currentPlayer, timers, isLoading]);

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Handle square clicks
    const handleSquareClick = async (square) => {
        if (winner || isAnimating || isLoading) return;

        if (selectedSquare) {
            if (selectedSquare === square) {
                setSelectedSquare(null);
                setValidMoves([]);
                return;
            }

            if (validMoves.includes(square)) {
                setIsAnimating(true);
                const move = game.move({
                    from: selectedSquare,
                    to: square,
                    promotion: "q",
                });

                if (move) {
                    setLastMove({ from: selectedSquare, to: square });

                    if (move.captured) {
                        setCapturedPieces((prev) => ({
                            ...prev,
                            [move.color]: [...prev[move.color], move.captured],
                        }));
                    }

                    await new Promise((resolve) => setTimeout(resolve, 300));

                    setGame(new Chess(game.fen()));
                    setCurrentPlayer(game.turn());
                    setIsAnimating(false);
                }
            }
            setSelectedSquare(null);
            setValidMoves([]);
        } else {
            const piece = game.get(square);
            if (piece?.color === currentPlayer) {
                const moves = game.moves({ square, verbose: true });
                if (moves.length > 0) {
                    setSelectedSquare(square);
                    setValidMoves(moves.map((m) => m.to));
                }
            }
        }
    };

    // Reset game
    const resetGame = () => {
        setIsLoading(true);
        setTimeout(() => {
            setGame(new Chess());
            setSelectedSquare(null);
            setValidMoves([]);
            setCapturedPieces({ w: [], b: [] });
            setCurrentPlayer("w");
            setTimers({ w: 300, b: 300 });
            setWinner(null);
            setLastMove(null);
            setIsLoading(false);
        }, 1000);
    };

    // Render
    return (
        <>
            <ChessPreloader isLoading={isLoading} />

            {!isLoading && game && (
                <div className="flex flex-col items-center gap-3 p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white w-full min-h-screen justify-center">
                    {winner ? (
                        <div className="flex flex-col items-center gap-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 drop-shadow-md text-center">
                                {winner === "Draw"
                                    ? "Game Ended in Draw!"
                                    : `${winner} Wins!`}
                            </h1>
                            <button
                                onClick={resetGame}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg transition-colors"
                            >
                                Play Again
                            </button>
                        </div>
                    ) : (
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md text-center">
                            Current Player:{" "}
                            {currentPlayer === "w" ? "White" : "Black"}
                        </h1>
                    )}

                    <div className="flex justify-between w-full max-w-xl px-4 text-sm sm:text-base md:text-lg font-semibold">
                        <h2
                            className={
                                currentPlayer === "w"
                                    ? "text-yellow-400"
                                    : "text-white"
                            }
                        >
                            White: {formatTime(timers.w)}
                        </h2>
                        <h2
                            className={
                                currentPlayer === "b"
                                    ? "text-yellow-400"
                                    : "text-white"
                            }
                        >
                            Black: {formatTime(timers.b)}
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 items-center">
                        <div className="w-10 h-40 sm:w-12 sm:h-48 md:w-16 md:h-60 lg:w-20 lg:h-72 border-2 md:border-4 border-black bg-white p-1 md:p-2 rounded-lg flex flex-col items-center overflow-y-auto shadow-md">
                            {capturedPieces.b.map((p, i) => (
                                <div key={i}>
                                    {pieceIcons[p]("text-black", "", null)}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-8 grid-rows-8 border-2 sm:border-4 md:border-6 lg:border-8 border-gray-600 rounded-lg sm:rounded-xl overflow-hidden w-[90vw] h-[90vw] max-w-[90vw] max-h-[90vw] sm:w-[80vw] sm:h-[80vw] md:w-[70vw] md:h-[70vw] lg:w-[650px] lg:h-[650px] aspect-square shadow-xl">
                            {game
                                .board()
                                .flat()
                                .map((square, index) => {
                                    const file = "abcdefgh"[index % 8];
                                    const rank = 8 - Math.floor(index / 8);
                                    const squareId = `${file}${rank}`;
                                    const isHighlighted =
                                        validMoves.includes(squareId);
                                    const isCaptureMove =
                                        isHighlighted && game.get(squareId);
                                    const squareBg =
                                        (index + Math.floor(index / 8)) % 2 ===
                                        0
                                            ? "bg-gray-300"
                                            : "bg-gray-700";

                                    return (
                                        <div
                                            key={squareId}
                                            className={clsx(
                                                "w-full h-full flex items-center justify-center relative",
                                                squareBg,
                                                isCaptureMove
                                                    ? "bg-red-500/70"
                                                    : isHighlighted
                                                    ? "bg-yellow-400/70"
                                                    : selectedSquare ===
                                                      squareId
                                                    ? "bg-blue-500/70"
                                                    : "",
                                                "transition-colors duration-200"
                                            )}
                                            onClick={() =>
                                                handleSquareClick(squareId)
                                            }
                                        >
                                            {square &&
                                                pieceIcons[
                                                    square.color === "w"
                                                        ? square.type
                                                        : square.type.toLowerCase()
                                                ](
                                                    square.color === "w"
                                                        ? "text-white"
                                                        : "text-black",
                                                    "transition-transform duration-100 hover:scale-110",
                                                    squareRefs.current[index]
                                                )}
                                        </div>
                                    );
                                })}
                        </div>

                        <div className="w-10 h-40 sm:w-12 sm:h-48 md:w-16 md:h-60 lg:w-20 lg:h-72 border-2 md:border-4 border-white bg-black p-1 md:p-2 rounded-lg flex flex-col items-center overflow-y-auto shadow-md">
                            {capturedPieces.w.map((p, i) => (
                                <div key={i}>
                                    {pieceIcons[p]("text-white", "", null)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={() => {
                                const move = game.undo();
                                if (move) {
                                    setLastMove(null);
                                    setCurrentPlayer(game.turn());
                                    setGame(new Chess(game.fen()));
                                }
                            }}
                            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors"
                            disabled={isAnimating}
                        >
                            Undo
                        </button>
                        <button
                            onClick={resetGame}
                            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
