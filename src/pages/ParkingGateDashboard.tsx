"use client";

import React, { useState, useEffect } from "react";
import ParkingGate from "@/components/ParkingGate";
import UltrasonicSensor from "@/components/UltrasonicSensor";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MadeWithDyad } from "@/components/made-with-dyad";

const ParkingGateDashboard: React.FC = () => {
  const [distance, setDistance] = useState<number>(50); // Initial distance in cm
  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (distance < 20) {
      setIsGateOpen(true);
    } else {
      setIsGateOpen(false);
    }
  }, [distance]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard Gerbang Parkir</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <UltrasonicSensor distance={distance} />
        <ParkingGate isOpen={isGateOpen} />
      </div>

      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">Simulasi Jarak Sensor</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="distance-slider" className="block text-center mb-4 text-lg">
            Jarak Terdeteksi: {distance} cm
          </Label>
          <Slider
            id="distance-slider"
            min={0}
            max={100}
            step={1}
            value={[distance]}
            onValueChange={(value) => setDistance(value[0])}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-4 text-center">
            Geser slider untuk mensimulasikan jarak yang terdeteksi oleh sensor.
            Gerbang akan terbuka jika jarak kurang dari 20 cm.
          </p>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default ParkingGateDashboard;