"use client";

import React, { useState, useEffect } from "react";
import ParkingGate from "@/components/ParkingGate";
import UltrasonicSensor from "@/components/UltrasonicSensor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useMqtt } from "@/hooks/useMqtt";
import { format } from "date-fns"; // Import date-fns for formatting timestamps

const MQTT_BROKER_URL = "ws://broker.hivemq.com:8000/mqtt";
const MQTT_TOPICS = ["parking/distance", "parking/counter"]; // Array of topics

const ParkingGateDashboard: React.FC = () => {
  const {
    distance: mqttDistance,
    counter: mqttCounter,
    counterLastUpdate,
    isConnected,
  } = useMqtt({
    brokerUrl: MQTT_BROKER_URL,
    topics: MQTT_TOPICS,
  });

  const [distance, setDistance] = useState<number>(50);
  const [counter, setCounter] = useState<number | null>(null);
  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);

  useEffect(() => {
    if (mqttDistance !== null) {
      setDistance(mqttDistance);
    }
  }, [mqttDistance]);

  useEffect(() => {
    setCounter(mqttCounter);
  }, [mqttCounter]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <UltrasonicSensor distance={distance} />
        <ParkingGate isOpen={isGateOpen} />

        {/* New Card for Vehicle Entry Counter */}
        <Card className="w-64 text-center">
          <CardHeader>
            <CardTitle>Jumlah Kendaraan Masuk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">
              {counter !== null ? counter : "N/A"}
            </p>
            {counterLastUpdate && (
              <Badge variant="secondary" className="mt-4">
                Terakhir Update: {format(counterLastUpdate, "HH:mm:ss")}
              </Badge>
            )}
            {counter === null && (
              <p className="text-sm text-gray-500 mt-2">Counter belum tersedia</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle>Status Koneksi MQTT</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-lg font-semibold ${isConnected ? "text-green-600" : "text-red-600"}`}>
            {isConnected ? "Terhubung" : "Terputus"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Mendengarkan topik: <span className="font-mono">{MQTT_TOPICS.join(", ")}</span>
          </p>
          <p className="text-sm text-gray-500">
            Broker: <span className="font-mono">{MQTT_BROKER_URL}</span>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Pastikan Node-RED Anda mengirim data jarak (angka) ke topik `parking/distance` dan jumlah kendaraan (angka) ke `parking/counter`.
          </p>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default ParkingGateDashboard;