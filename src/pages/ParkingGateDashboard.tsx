"use client";

import React, { useState, useEffect, useRef } from "react";
import ParkingGate from "@/components/ParkingGate";
import UltrasonicSensor from "@/components/UltrasonicSensor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useMqtt } from "@/hooks/useMqtt";
import { format } from "date-fns";
import { Car, XCircle, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MQTT_BROKER_URL = "ws://broker.hivemq.com:8000/mqtt";
const MQTT_TOPICS = ["parking/distance"];

const MAX_PARKING_CAPACITY = 20;
const LOCAL_STORAGE_KEY_COUNT = "parking_vehicle_entry_count";
const LOCAL_STORAGE_KEY_LAST_ENTRY = "parking_last_entry_time";

const ParkingGateDashboard: React.FC = () => {
  const {
    distance: mqttDistance,
    isConnected,
  } = useMqtt({
    brokerUrl: MQTT_BROKER_URL,
    topics: MQTT_TOPICS,
  });

  const [distance, setDistance] = useState<number>(50);
  const [isGateOpen, setIsGateOpen] = useState<boolean>(false);
  
  // Inisialisasi state dari localStorage atau nilai default
  const [vehicleEntryCount, setVehicleEntryCount] = useState<number>(() => {
    const storedCount = localStorage.getItem(LOCAL_STORAGE_KEY_COUNT);
    return storedCount ? parseInt(storedCount, 10) : 0;
  });
  const [lastEntryTime, setLastEntryTime] = useState<Date | null>(() => {
    const storedTime = localStorage.getItem(LOCAL_STORAGE_KEY_LAST_ENTRY);
    return storedTime ? new Date(storedTime) : null;
  });

  const [isParkingFull, setIsParkingFull] = useState<boolean>(false);

  const prevIsGateOpenRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mqttDistance !== null) {
      setDistance(mqttDistance);
    }
  }, [mqttDistance]);

  // Logika untuk menentukan apakah parkir penuh
  useEffect(() => {
    setIsParkingFull(vehicleEntryCount >= MAX_PARKING_CAPACITY);
    // Simpan vehicleEntryCount ke localStorage setiap kali berubah
    localStorage.setItem(LOCAL_STORAGE_KEY_COUNT, vehicleEntryCount.toString());
  }, [vehicleEntryCount]);

  // Logika untuk membuka/menutup gerbang berdasarkan jarak DAN status parkir
  useEffect(() => {
    if (distance < 20 && !isParkingFull) {
      setIsGateOpen(true);
    } else {
      setIsGateOpen(false);
    }
  }, [distance, isParkingFull]);

  useEffect(() => {
    const prevIsGateOpen = prevIsGateOpenRef.current;
    if (isGateOpen && !prevIsGateOpen) {
      const newCount = vehicleEntryCount + 1;
      setVehicleEntryCount(newCount);
      const newTime = new Date();
      setLastEntryTime(newTime);
      // Simpan lastEntryTime ke localStorage setiap kali berubah
      localStorage.setItem(LOCAL_STORAGE_KEY_LAST_ENTRY, newTime.toISOString());
    }
    prevIsGateOpenRef.current = isGateOpen;
  }, [isGateOpen, vehicleEntryCount]); // Tambahkan vehicleEntryCount sebagai dependency

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    // Tidak menghapus data kendaraan masuk dari localStorage saat logout
    toast.info("Anda telah logout.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Gerbang Parkir</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <UltrasonicSensor distance={distance} />
        <ParkingGate isOpen={isGateOpen} />

        {/* Card untuk Jumlah Kendaraan Masuk */}
        <Card className="w-64 text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Car className="text-gray-600" />
              Kendaraan Masuk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">
              {vehicleEntryCount} / {MAX_PARKING_CAPACITY}
            </p>
            {lastEntryTime && (
              <Badge variant="secondary" className="mt-4">
                Terakhir Masuk: {format(lastEntryTime, "HH:mm:ss")}
              </Badge>
            )}
            {vehicleEntryCount === 0 && !lastEntryTime && (
              <p className="text-sm text-gray-500 mt-2">Belum ada kendaraan masuk</p>
            )}
          </CardContent>
        </Card>

        {/* Card untuk Status Parkir */}
        <Card className="w-64 text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              {isParkingFull ? (
                <XCircle className="text-red-500" />
              ) : (
                <CheckCircle className="text-green-500" />
              )}
              Status Parkir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-4xl font-bold ${isParkingFull ? "text-red-600" : "text-green-600"}`}>
              {isParkingFull ? "Penuh" : "Tersedia"}
            </p>
            {!isParkingFull && (
              <p className="text-sm text-gray-500 mt-2">
                Tersisa {MAX_PARKING_CAPACITY - vehicleEntryCount} slot
              </p>
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
            Pastikan Node-RED Anda mengirim data jarak (angka) ke topik `parking/distance`.
          </p>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default ParkingGateDashboard;