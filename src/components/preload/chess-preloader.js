"use client";

import { FaChessQueen, FaChessKing } from "react-icons/fa";

export default function ChessPreloader({ isLoading }) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center gap-8">
            <div className="relative w-64 h-64">
                <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-battle-white">
                    <FaChessQueen className="text-6xl text-white animate-pulse" />
                </div>
                <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-battle-black">
                    <FaChessKing className="text-6xl text-black animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-500 opacity-0 animate-clash"></div>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white animate-pulse">
                Preparing Chess Battle...
            </h2>

            <style jsx global>{`
                @keyframes battle-white {
                    0%,
                    100% {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    50% {
                        transform: translate(-70%, -50%) rotate(-15deg)
                            scale(1.1);
                    }
                }
                @keyframes battle-black {
                    0%,
                    100% {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    50% {
                        transform: translate(-30%, -50%) rotate(15deg)
                            scale(1.1);
                    }
                }
                @keyframes clash {
                    0% {
                        transform: scale(0);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.4;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
                .animate-battle-white {
                    animation: battle-white 1.8s infinite ease-in-out;
                }
                .animate-battle-black {
                    animation: battle-black 1.8s infinite ease-in-out;
                }
                .animate-clash {
                    animation: clash 1.8s infinite;
                }
            `}</style>
        </div>
    );
}
