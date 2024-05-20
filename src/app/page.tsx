"use client";
import { useState } from "react";
import "react";

import { Icon } from '@iconify-icon/react';


function extractTrackID(spotifyURL: string): string | null {
  try {
      const url = new URL(spotifyURL);
      const pathSegments = url.pathname.split('/');

      if (pathSegments.length > 2 && pathSegments[1] === 'track') {
          return pathSegments[2];
      }
  } catch (error) {
      console.error('Invalid URL:', error);
  }

  return null;
}


export default function Home() {
  const [trackUrl, setTrackUrl] = useState("");
  const [tempo, setTempo] = useState(0);
  const [loading, setLoading] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-5xl font-bold">Spotify BPM Detective</h1>
      <p className="text-2xl">
        Find the tempo of any Spotify track
      </p>
      {!loading && <p className="text-2xl">Tempo: {tempo} BPM</p>}
      {loading && <p className="text-2xl">Loading...</p>}
      <form 
      className="flex flex-col items-center justify-center w-full max-w-4xl p-4 space-y-4 border border-gray-300 rounded-xl dark:border-neutral-800 lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-8 lg:dark:border-neutral-800 lg:rounded-xl lg:bg-gray-200 lg:dark:bg-zinc-800/30 lg:backdrop-blur-xl"
      onSubmit={(e) => {
        e.preventDefault()
        // loading
        setTempo(0)
        setLoading(true)
        const trackId = extractTrackID(trackUrl)
        fetch(`https://bpm-finder.fly.dev/tempo/${trackId}`)
          .then((res) => res.json())
          .then((data) => {
            setTempo(data.tempo)
          })
          .catch((err) => {
            console.error(err)
          }
        )
        .finally(() => {
          setLoading(false)
        })
      }}
      >
        <input
          type="text"
          placeholder="Enter a track URL"
          className="w-full p-2 border border-gray-300 rounded-lg dark:border-neutral-800 lg:w-96 lg:dark:border-neutral-800 lg:bg-gray-200 lg:dark:bg-zinc-800/30 lg:backdrop-blur-xl"
          onChange={(e) => {
            e.preventDefault()
            setTrackUrl(e.target.value)
          }}
          value={trackUrl}
        />
        <button
          type="submit"
          className="p-2 text-white bg-gray-900 rounded-lg dark:bg-neutral-900 lg:w-24 lg:dark:bg-neutral-900"
        >
          Fetch
        </button>
      </form>
      <p>Built with <Icon icon="noto:heart-suit" /> in Rio</p>
    </main>
  );
}
