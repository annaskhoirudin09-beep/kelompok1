"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ParkingGateProps {
  isOpen: boolean;
}

const ParkingGate: React.FC<ParkingGateProps> = ({ isOpen }) => {
  return (
    <div className="relative w-64 h-20 bg-gray-200 rounded-md overflow-hidden shadow-lg">
      {/* Base of the gate */}
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-700"></div>
      {/* Gate arm */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-4 bg-red-600 rounded-sm origin-bottom-left transition-transform duration-500 ease-in-out",
          isOpen ? "-rotate-90" : "rotate-0"
        )}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 rounded-sm"></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-around">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ParkingGate;