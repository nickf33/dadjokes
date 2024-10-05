"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import bgImg from "./assets/bg_dj.jpg";

export default function Home() {
  const [joke, setJoke] = useState({ setup: "", punchline: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const splitJoke = (jokeText) => {
    const splitPatterns = [". ", "? ", "! ", ": ", "... "];

    for (let pattern of splitPatterns) {
      const parts = jokeText.split(pattern);
      if (parts.length > 1) {
        return [parts[0] + pattern, parts.slice(1).join(pattern)];
      }
    }

    return [jokeText, ""];
  };

  const fetchJoke = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch joke");
      }
      const data = await response.json();
      const [setup, punchline] = splitJoke(data.joke);
      setJoke({ setup, punchline });
    } catch (err) {
      setError("Failed to fetch a joke. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <main className="relative grid place-content-center h-screen w-screen overflow-hidden">
      <Image
        src={bgImg}
        alt="smiley faces"
        width={1000}
        height={1000}
        className="absolute inset-0 w-screen h-screen z-[-1] object-cover object-center"
      />
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center p-4"
        style={{ backgroundImage: "url('/myapi/bg_dj.jpg')" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md w-full min-h-[20rem] flex flex-col justify-between">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Dad Joke Generator
          </h1>
          {isLoading ? (
            <div className="loader border-4 border-blue-200 rounded-full w-12 h-12 mx-auto">
              <div className="border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <p className="text-lg mb-4 min-h-[3rem]">{joke.setup}</p>
              <p className="text-lg font-bold text-gray-800 mb-4 min-h-[3rem]">
                {joke.punchline}
              </p>
            </>
          )}
          <button
            onClick={fetchJoke}
            disabled={isLoading}
            className="bg-red-600 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Get Another Joke"}
          </button>
        </div>
      </div>
    </main>
  );
}
