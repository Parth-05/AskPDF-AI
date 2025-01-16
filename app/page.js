"use client";
import { api } from "../convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
// import Head from 'next/head';
import { useEffect } from "react";

export default function Home() {

  const {user} = useUser();
  const createUser = useMutation(api.user.createUser);

  const checkUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName
    });
    console.log(result)
  }

  useEffect(() => {
    user && checkUser();
  }, [user])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-orange-400 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to AskPDF AI</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your AI-powered PDF Assistant
        </h1>
        <p className="text-lg text-gray-600 text-center mb-6 max-w-2xl">
          AskPDF AI helps you interact with and get answers from your PDF
          documents effortlessly. Upload your files and let our AI do the rest!
        </p>
        <a
          href="/dashboard"
          className="bg-orange-400 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </main>

      <footer className="bg-gray-100 text-gray-600 py-4 text-center">
        <p>
          &copy; 2024 AskPDF AI
        </p>
      </footer>
    </div>
  );
}
