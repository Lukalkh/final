"use client";

import { useState } from "react";
import { SPORT_LIST, SPORTS, skillOf } from "@/lib/sports";
import { useStore } from "@/lib/store";

export function Onboard() {
  const { profile, setProfile, setSkill } = useStore();
  const [name, setName] = useState(profile.displayName);
  const [error, setError] = useState("");

  function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Add the name people will see.");
      return;
    }
    setProfile({ displayName: trimmed, setup: true });
  }

  return (
    <div className="gate">
      <p className="kicker">Start here</p>
      <h1>Who’s playing?</h1>
      <p className="lede">Name and skill. Then you can join, post, or hold a sheet.</p>
      <div className="panel stack" style={{ marginTop: 20 }}>
        <label>
          Name
          <input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
          />
        </label>
        {SPORT_LIST.map((id) => (
          <label key={id}>
            {SPORTS[id].label} · {SPORTS[id].skill}
            <input
              type="number"
              min={0}
              max={SPORTS[id].skillMax}
              step={SPORTS[id].skillStep}
              value={skillOf(profile, id)}
              onChange={(e) => setSkill(id, Number(e.target.value))}
            />
          </label>
        ))}
        {error ? <p className="fine warn">{error}</p> : null}
        <button className="btn clay wide" type="button" onClick={save}>
          Enter
        </button>
      </div>
    </div>
  );
}
