"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
    const [carros, setCarros] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [filtro, setFiltro] = useState<"todos" | "vendidos" | "naoVendidos">("todos");
    const [modalAberto, setModalAberto] = useState(false);
    const [carroSelecionado, setCarroSelecionado] = useState<any>(null);
    const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [modoCriacao, setModoCriacao] = useState(false);

    const [formCarro, setFormCarro] = useState({
        name: "",
        year: "",
        description: "",
        sold: false,
    });

    const listarCarros = async () => {
        setCarregando(true);
        setErro("");
        setCarros([]);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Token não encontrado. Faça login novamente.");
                setCarregando(false);
                return;
            }

            const resposta = await fetch("https://cars-api-y4ym.onrender.com/api/cars", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.mensagem || "Erro ao buscar carros");
            }

            const dados = await resposta.json();
            setCarros(dados.items);
            setFiltro("todos");
        } catch (err: any) {
            setErro(err.message || "Erro inesperado");
        } finally {
            setCarregando(false);
        }
    };

    const filtrarCarros = () => {
        if (filtro === "vendidos") {
            return carros.filter((carro) => carro.sold);
        } else if (filtro === "naoVendidos") {
            return carros.filter((carro) => !carro.sold);
        }
        return carros;
    };

    const getCarroById = async (id: string) => {
        setCarregandoDetalhes(true);
        setErro("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Token não encontrado.");
                return;
            }

            const resposta = await fetch(`https://cars-api-y4ym.onrender.com/api/cars/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.mensagem || "Erro ao buscar detalhes do carro");
            }

            const dados = await resposta.json();
            setCarroSelecionado(dados);
            setModalAberto(true);
            setModoEdicao(false);
            setModoCriacao(false);
        } catch (err: any) {
            setErro(err.message || "Erro inesperado ao buscar detalhes");
        } finally {
            setCarregandoDetalhes(false);
        }
    };

    const abrirEdicao = (carro: any) => {
        setCarroSelecionado(carro);
        setFormCarro({
            name: carro.name,
            year: carro.year.toString(),
            description: carro.description,
            sold: carro.sold,
        });
        setModoEdicao(true);
        setModoCriacao(false);
        setModalAberto(true);
        setErro("");
    };

    // Função para abrir modal para criação de novo carro
    const abrirCriacao = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErro("Token não encontrado. Faça login novamente.");
            return;
        }

        setFormCarro({
            name: "",
            year: "",
            description: "",
            sold: false,
        });
        setModoCriacao(true);
        setModoEdicao(false);
        setModalAberto(true);
        setErro("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormCarro((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const salvarEdicao = async () => {
        setErro("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Token não encontrado.");
                return;
            }

            const resposta = await fetch(
                `https://cars-api-y4ym.onrender.com/api/cars/${carroSelecionado.id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formCarro.name,
                        year: Number(formCarro.year),
                        description: formCarro.description,
                        sold: formCarro.sold,
                    }),
                }
            );

            if (!resposta.ok) {
                const textoErro = await resposta.text();
                throw new Error(textoErro || "Erro ao atualizar carro");
            }

            const dadosAtualizados = await resposta.json();

            setCarros((prev) =>
                prev.map((carro) => (carro.id === dadosAtualizados.id ? dadosAtualizados : carro))
            );

            setModalAberto(false);
            setModoEdicao(false);
        } catch (err: any) {
            setErro(err.message || "Erro inesperado ao salvar");
        }
    };

    const salvarCriacao = async () => {
        setErro("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Token não encontrado.");
                return;
            }

            // Função para decodificar token JWT
            const parseJwt = (token: string) => {
                const base64Payload = token.split('.')[1];
                return JSON.parse(atob(base64Payload));
            };

            const payload = parseJwt(token);
            const userId = payload?.user_id;

            if (!userId) {
                setErro("Usuário não encontrado no token.");
                return;
            }

            const resposta = await fetch(`https://cars-api-y4ym.onrender.com/api/cars`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: userId,
                    name: formCarro.name,
                    year: Number(formCarro.year),
                    description: formCarro.description,
                    sold: formCarro.sold,
                }),
            });


            if (!resposta.ok) {
                const textoErro = await resposta.text();
                throw new Error(textoErro || "Erro ao criar carro");
            }

            const novoCarro = await resposta.json();

            setCarros((prev) => [...prev, novoCarro]); // atualiza lista local
            setModalAberto(false);
            setModoCriacao(false);
        } catch (err: any) {
            setErro(err.message || "Erro inesperado ao criar");
        }
    };


    const excluirCarro = async () => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este carro?");
        if (!confirmacao) {
            return; // Se o usuário cancelar, não faz nada.
        }

        setErro("");
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Token não encontrado.");
                return;
            }

            const resposta = await fetch(
                `https://cars-api-y4ym.onrender.com/api/cars/${carroSelecionado.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.mensagem || "Erro ao excluir carro");
            }

            // Remove o carro da lista local
            setCarros((prev) => prev.filter((carro) => carro.id !== carroSelecionado.id));

            // Fecha o modal
            setModalAberto(false);
            setModoEdicao(false);
        } catch (err: any) {
            setErro(err.message || "Erro inesperado ao excluir");
        }
    };

    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const emailSalvo = localStorage.getItem("email");
        if (emailSalvo) {
            setUserEmail(emailSalvo);
        }
    }, []);

    return (
        <div className="p-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-center flex-1">Bem-vindo(a) ao seu Dashboard, {userEmail}</h1>
            </header>

            <div className="flex justify-between mb-4 items-center">
                <div className="flex gap-4">
                    <button
                        onClick={listarCarros}
                        className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-xl"
                    >
                        
                        {carregando ? "Carregando..." : "Ver todos os carros"}
                    </button>

                    <button
                        onClick={() => setFiltro("vendidos")}
                        className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-2xl"
                        
                    >
                        Vendidos
                    </button>

                    <button
                        onClick={() => setFiltro("naoVendidos")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-2xl"
                        
                    >
                        Não Vendidos
                    </button>
                </div>

                <button
                    onClick={abrirCriacao}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full"
                    title="Criar novo carro"
                >
                    +
                </button>
            </div>

            {erro && <p className="text-red-500 mb-4">{erro}</p>}

            {filtrarCarros().length > 0 ? (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className="border border-gray-300 px-4 py-2">Nome</th>
                            <th className="border border-gray-300 px-4 py-2">Ano</th>
                            <th className="border border-gray-300 px-4 py-2">Descrição</th>
                            <th className="border border-gray-300 px-4 py-2">Vendido</th>
                            <th className="border border-gray-300 px-4 py-2">Usuário</th>
                            <th className="border border-gray-300 px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarCarros().map((carro) => (
                            <tr key={carro.id} className="hover:bg-gray-50">
                                <td className="border border-gray-400 px-4 py-2">{carro.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{carro.year}</td>
                                <td className="border border-gray-400 px-4 py-2">{carro.description}</td>
                                <td className="border border-gray-400 px-4 py-2 text-center">{carro.sold ? "Sim" : "Não"}</td>
                                <td className="border border-gray-400 px-4 py-2">{carro.user?.email || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 flex justify-center">
                                    <button
                                        onClick={() => getCarroById(carro.id)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-4xl mr-2"
                                    >
                                        Ver
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p></p>
            )}

            
            {modalAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {modoCriacao
                                ? "Criar Novo Carro"
                                : modoEdicao
                                    ? "Editar Carro"
                                    : "Detalhes do Carro"}
                        </h2>

                        {(modoCriacao || modoEdicao) ? (
                            <>
                                <label className="block mb-2">
                                    Nome:
                                    <input
                                        type="text"
                                        name="name"
                                        value={formCarro.name}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full p-2"
                                    />
                                </label>

                                <label className="block mb-2">
                                    Ano:
                                    <input
                                        type="number"
                                        name="year"
                                        value={formCarro.year}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full p-2"
                                    />
                                </label>

                                <label className="block mb-2">
                                    Descrição:
                                    <textarea
                                        name="description"
                                        value={formCarro.description}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-full p-2"
                                    />
                                </label>

                                <label className="block mb-4">
                                    <input
                                        type="checkbox"
                                        name="sold"
                                        checked={formCarro.sold}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Vendido
                                </label>

                                {erro && <p className="text-red-500 mb-2">{erro}</p>}

                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setModalAberto(false);
                                            setModoCriacao(false);
                                            setModoEdicao(false);
                                            setErro("");
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                                    >
                                        Cancelar
                                    </button>

                                    {modoCriacao && (
                                        <button
                                            onClick={salvarCriacao}
                                            className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded"
                                        >
                                            Salvar
                                        </button>
                                    )}

                                    {modoEdicao && (
                                        <>
                                            <button
                                                onClick={salvarEdicao}
                                                className="bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded"
                                            >
                                                Salvar
                                            </button>

                                            <button
                                                onClick={excluirCarro}
                                                className="bg-red-800 hover:bg-red-700 text-white py-2 px-4 rounded"
                                            >
                                                Excluir
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {carregandoDetalhes ? (
                                    <p>Carregando detalhes...</p>
                                ) : (
                                    <>
                                        <p><strong>Nome:</strong> {carroSelecionado?.name}</p>
                                        <p><strong>Ano:</strong> {carroSelecionado?.year}</p>
                                        <p><strong>Descrição:</strong> {carroSelecionado?.description}</p>
                                        <p><strong>Vendido:</strong> {carroSelecionado?.sold ? "Sim" : "Não"}</p>
                                        <p><strong>Usuário:</strong> {carroSelecionado?.user?.email || "N/A"}</p>

                                        <div className="flex justify-end mt-4 gap-4">
                                            <button
                                                onClick={() => setModalAberto(false)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                                            >
                                                Fechar
                                            </button>

                                            <button
                                                onClick={() => abrirEdicao(carroSelecionado)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
