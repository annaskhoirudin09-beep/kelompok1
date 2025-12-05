"use client";

import React from "react";
import { Radar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UltrasonicSensorProps {
  distance: number;
}

const UltrasonicSensor: React.FC<UltrasonicSensorProps> = ({ distance }) => {
  const isClose = distance < 20;
  return (
    <Card className="w-64 text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Radar className={isClose ? "text-red-500 animate-pulse" : "text-blue-500"} />
          Sensor Ultrasonik
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold">
          {distance} <span className="text-xl text-gray-500">cm</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {isClose ? "Objek Terdeteksi!" : "Tidak Ada Objek"}
        </p>
      </CardContent>
    </Card>
  );
};

export default UltrasonicSensor;