import React from "react";

interface RotatedLetterProps {
  letter: string;
  rotation: number;
  className?: string;
}

export const RotatedLetter: React.FC<RotatedLetterProps> = ({
  letter,
  rotation,
  className = "",
}) => {
  return (
    <div
      className={`text-white font-medium text-8xl ${className}`}
      style={{ transform: `rotate(${rotation}rad)` }}
      role="presentation"
    >
      {letter}
    </div>
  );
};
