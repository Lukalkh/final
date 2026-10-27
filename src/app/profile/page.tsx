"use client";

import { useRouter } from "next/navigation";
import { SPORT_LIST, SPORTS, skillOf } from "@/lib/sports";
import { useStore } from "@/lib/store";
import type { Pace, WalkPref } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, setProfile, setSkill } = useStore();

  return (
    <div style={{ maxWidth: 400 }}>
      <h1>How you play</h1>
      <p className="lede">One person. Three sports. Used only for matching.</p>
      <form
        className="panel"
        style={{ marginTop: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          const name = profile.displayName.trim();
          if (!name) return;
          setProfile({ displayName: name, setup: true });
          router.push("/");
        }}
      >
        <div className="stack">
          <label>
            Name
            <input
              value={profile.displayName}
              onChange={(e) => setProfile({ displayName: e.target.value })}
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
          <label>
            Pace
            <select
              value={profile.pace}
              onChange={(e) => setProfile({ pace: e.target.value as Pace })}
            >
              <option value="fast">Fast</option>
              <option value="steady">Steady</option>
              <option value="leisurely">Leisurely</option>
            </select>
          </label>
          <label>
            Walk
            <select
              value={profile.walk}
              onChange={(e) => setProfile({ walk: e.target.value as WalkPref })}
            >
              <option value="walk">Walk</option>
              <option value="ride">Ride</option>
              <option value="either">Either</option>
            </select>
          </label>
          <label>
            Strangers
            <select
              value={profile.strangersOk ? "yes" : "no"}
              onChange={(e) => setProfile({ strangersOk: e.target.value === "yes" })}
            >
              <option value="yes">Yes</option>
              <option value="no">Friends only</option>
            </select>
          </label>
        </div>
        <button className="btn clay wide" type="submit" disabled={!profile.displayName.trim()}>
          Save
        </button>
      </form>
    </div>
  );
}
