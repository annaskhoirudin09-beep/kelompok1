"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import mqtt from "mqtt";
import { toast } from "sonner";

interface MqttHookOptions {
  brokerUrl: string;
  topics: string[]; // Mengubah topic menjadi array of topics
}

interface MqttMessageState {
  [topic: string]: {
    payload: string | null;
    timestamp: Date | null;
  };
}

export function useMqtt({ brokerUrl, topics }: MqttHookOptions) {
  const [messages, setMessages] = useState<MqttMessageState>(
    topics.reduce((acc, topic) => ({
      ...acc,
      [topic]: { payload: null, timestamp: null },
    }), {})
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);

  // Fungsi untuk mengirim pesan ke broker MQTT
  const publish = useCallback((topic: string, payload: string, options?: mqtt.IClientPublishOptions) => {
    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(topic, payload, options, (err) => {
        if (err) {
          toast.error(`Gagal mengirim pesan ke topik ${topic}: ${err.message}`);
        }
        // Tidak menampilkan toast sukses untuk setiap pesan yang dikirim agar tidak terlalu banyak notifikasi
      });
    } else {
      toast.error("Tidak terhubung ke broker MQTT. Gagal mengirim pesan.");
    }
  }, []);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl);
    mqttClientRef.current = client;

    client.on("connect", () => {
      setIsConnected(true);
      toast.success("Terhubung ke broker MQTT!");
      topics.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (!err) {
            toast.info(`Berlangganan topik: ${topic}`);
          } else {
            toast.error(`Gagal berlangganan topik ${topic}: ${err.message}`);
          }
        });
      });
    });

    client.on("message", (receivedTopic, receivedMessage) => {
      // Hanya memperbarui state jika topik yang diterima adalah salah satu yang kita dengarkan
      if (topics.includes(receivedTopic)) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [receivedTopic]: {
            payload: receivedMessage.toString(),
            timestamp: new Date(),
          },
        }));
      }
    });

    client.on("error", (err) => {
      toast.error(`Kesalahan MQTT: ${err.message}`);
      setIsConnected(false);
      client.end();
    });

    client.on("close", () => {
      setIsConnected(false);
      toast.warning("Koneksi MQTT terputus.");
    });

    return () => {
      if (mqttClientRef.current && mqttClientRef.current.connected) {
        topics.forEach((topic) => mqttClientRef.current?.unsubscribe(topic));
        mqttClientRef.current.end();
        toast.info("Koneksi MQTT dihentikan.");
      }
    };
  }, [brokerUrl, topics]);

  const distanceMessage = messages["parking/distance"]?.payload;
  const exitDistanceMessage = messages["parking/exitDistance"]?.payload; // New exit distance message

  return {
    distance: distanceMessage ? parseInt(distanceMessage, 10) : null,
    exitDistance: exitDistanceMessage ? parseInt(exitDistanceMessage, 10) : null, // Return exit distance
    isConnected,
    publish, // Mengembalikan fungsi publish
  };
}