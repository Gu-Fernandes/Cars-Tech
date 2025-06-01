"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("https://cars-api-y4ym.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      });

      const dados = await resposta.json();



      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Usuário ou senha incorretos!");
      }

      localStorage.setItem("token", dados.access_token);
      localStorage.setItem("email", email);



      router.push("/dashboard");

    } catch (err: any) {
      setErro(err.message || "Erro inesperado");
    } finally {
      setCarregando(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-500 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-5"

      >
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h1>

        
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          disabled={carregando}
          className="bg-red-800 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}