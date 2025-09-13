import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Wifi, Cpu, Zap, Settings, Play, StopCircle, CheckCircle, Repeat } from "lucide-react";

// Lightweight, easy-to-read control panel for a 6-DOF robot arm (ESP32-driven).
// Thiết kế: 3 tab - Trang chủ, Điều khiển (gộp trạng thái), Cài đặt.

const TABS = [
  { key: "home", label: "Trang chủ", icon: Home },
  { key: "control", label: "Điều khiển", icon: Zap },
  { key: "settings", label: "Cài đặt", icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function FancyTabbedSite() {
  const [active, setActive] = useState<TabKey>("home");

  // connection state to ESP32 (mocked). Replace with real WebSocket/MQTT/HTTP logic.
  const [connected, setConnected] = useState(false);
  const [ip, setIp] = useState("192.168.4.1");
  const [port, setPort] = useState("80");

  // Joint values: Joint 1..6, degrees
  const [joints, setJoints] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  const lastSentRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      // cleanup connections if any
    };
  }, []);

  function updateJoint(index: number, value: number) {
    setJoints((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  function sendCommand(payload: object) {
    const str = JSON.stringify(payload);
    lastSentRef.current = str;
    console.log("Gửi tới ESP32:", str);
  }

  function handleConnectToggle() {
    setConnected((c) => !c);
  }

  function handleHome() {
    const homePose = [0, 0, 0, 0, 0, 0];
    setJoints(homePose);
    sendCommand({ type: "home", pose: homePose });
  }

  function handleReady() {
    const readyPose = [0, -45, 45, 0, 30, 0];
    setJoints(readyPose);
    sendCommand({ type: "ready", pose: readyPose });
  }

  function handleStop() {
    sendCommand({ type: "estop" });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur px-4 py-3 border-b border-white/5">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/5 grid place-items-center">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">Robot Arm 6 DOF</div>
              <div className="text-xs text-white/60">Điều khiển đơn giản qua ESP32</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full px-3 py-1 bg-white/5 border border-white/10">
              <Wifi className="h-4 w-4" />
              <div className="text-sm">{connected ? "Đã kết nối" : "Chưa kết nối"}</div>
            </div>
            <button
              onClick={handleConnectToggle}
              className="rounded-md px-3 py-1 bg-white/6 hover:bg-white/8 text-sm"
            >
              {connected ? "Ngắt kết nối" : "Kết nối"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Tabs */}
        <div className="rounded-2xl bg-white/3 p-1 inline-flex gap-1 shadow-sm w-full max-w-md mx-auto mb-6">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${active === key ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {/* content here, rút gọn để giữ ngắn */}
          </AnimatePresence>
        </div>

        <footer className="mt-10 text-center text-xs text-white/60">© {new Date().getFullYear()} • Giao diện đơn giản — Sẵn sàng mở rộng</footer>
      </main>
    </div>
  );
}
