"use client";

import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const PRESET = `> initializing connection...
> bypassing firewall [OK]
> injecting payload...
> access granted.
> downloading mainframe.dat [######################] 100%
> connection closed.`;

export default function HackerTerminalPage() {
  const [script, setScript] = useState(PRESET);
  const [output, setOutput] = useState("");
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  function play() {
    if (playing) return;
    setPlaying(true);
    setOutput("");
    let i = 0;

    function tick() {
      if (i >= script.length) {
        setPlaying(false);
        return;
      }
      setOutput((prev) => prev + script[i]);
      i++;
      const delay = script[i - 1] === "\n" ? 120 : 15 + Math.random() * 25;
      timeoutRef.current = window.setTimeout(tick, delay);
    }
    tick();
  }

  function stop() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setPlaying(false);
  }

  return (
    <ToolLayout title="Fake Hacker Terminal" description="Play back any text as an animated hacker-style terminal typing effect.">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Script</span>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={6}
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm"
        />
      </label>

      <div className="flex gap-3">
        <button
          onClick={play}
          disabled={playing}
          className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
        >
          {playing ? "Playing…" : "Play"}
        </button>
        {playing && (
          <button onClick={stop} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
            Stop
          </button>
        )}
      </div>

      <div className="min-h-64 whitespace-pre-wrap rounded-2xl border border-border bg-black p-5 font-mono text-sm text-green-400">
        {output}
        <span className="animate-pulse">▌</span>
      </div>
    </ToolLayout>
  );
}
