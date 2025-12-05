"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { toast } from "sonner";

interface MqttHookOptions {
  brokerUrl: string;
  topic: string;
}

export function useMqtt({ brokerUrl, topic }: MqttHookOptions) {
  const [message, setMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      setIsConnected(true);
      toast.success("Terhubung ke broker MQTT!");
      client.subscribe(topic, (err) => {
        if (!err) {
          toast.info(`Berlangganan topik: ${topic}`);
        } else {
          toast.error(`Gagal berlangganan topik ${topic}: ${err.message}`);
        }
      });
    });

    client.on("message", (receivedTopic, receivedMessage) => {
      if (receivedTopic === topic) {
        setMessage(receivedMessage.toString());
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
      if (client.connected) {
        client.unsubscribe(topic);
        client.end();
        toast.info("Koneksi MQTT dihentikan.");
      }
    };
  }, [brokerUrl, topic]);

  return { message, isConnected };
}