import { useState } from "react";
import { useProdutoDados } from "../hooks/useProdutoDados";
import { useProdutoCriar } from "../hooks/useProdutoCriar";
import { useProdutoEditar } from "../hooks/useProdutoEditar";
import { useProdutoDeletar } from "../hooks/useProdutoDeletar";
import type { ProdutoDados } from "../interface/ProdutoDados";
import "./TesteProdutos.css";

export default function TesteProdutos() {
    const { produtos, carregando, erro } = useProdutoDados(false);
    const { criarProduto } = useProdutoCriar();
    const { editarProduto } = useProdutoEditar();
    const { deletarProduto } = useProdutoDeletar();

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: 0,
        categoria: "",
        disponibilidade: true,
        imagem: "",
    });

    const [editando, setEditando] = useState<ProdutoDados | null>(null);
    const [mensagem, setMensagem] = useState("");

    const limparForm = () => {
        setForm({
            nome: "",
            descricao: "",
            preco: 0,
            categoria: "",
            disponibilidade: true,
            imagem: "",
        });
        setEditando(null);
        setMensagem("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : name === "preco" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editando) {
            const resultado = await editarProduto(editando.id!, form);
            if (resultado) {
                setMensagem("✅ Produto editado com sucesso!");
                limparForm();
                window.location.reload();
            } else {
                setMensagem("❌ Erro ao editar produto");
            }
        } else {
            const resultado = await criarProduto(form);
            if (resultado) {
                setMensagem("✅ Produto criado com sucesso!");
                limparForm();
                window.location.reload();
            } else {
                setMensagem("❌ Erro ao criar produto");
            }
        }
    };

    const handleDeletar = async (id: number) => {
        if (confirm("Tem certeza que quer desativar este produto?")) {
            const resultado = await deletarProduto(id);
            if (resultado) {
                setMensagem("✅ Produto desativado!");
                window.location.reload();
            } else {
                setMensagem("❌ Erro ao desativar");
            }
        }
    };

    const handleEditar = (produto: ProdutoDados) => {
        setEditando(produto);
        setForm({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            categoria: produto.categoria,
            disponibilidade: produto.disponibilidade,
            imagem: produto.imagem,
        });
        setMensagem("");
    };

    return (
        <div className="teste-container">
            <h1>Teste de Produtos</h1>

            {mensagem && <div className="mensagem">{mensagem}</div>}

            <div className="teste-layout">
                <div className="teste-form">
                    <h2>{editando ? "Editar Produto" : "Criar Novo Produto"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="campo">
                            <label>Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="campo">
                            <label>Descrição</label>
                            <input
                                type="text"
                                name="descricao"
                                value={form.descricao}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="campo">
                            <label>Preço</label>
                            <input
                                type="number"
                                name="preco"
                                step="0.01"
                                value={form.preco}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="campo">
                            <label>Categoria</label>
                            <input
                                type="text"
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="campo">
                            <label>URL da Imagem</label>
                            <input
                                type="text"
                                name="imagem"
                                value={form.imagem}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="campo campo--check">
                            <label>
                                <input
                                    type="checkbox"
                                    name="disponibilidade"
                                    checked={form.disponibilidade}
                                    onChange={handleChange}
                                />
                                Disponível
                            </label>
                        </div>

                        <div className="form-acoes">
                            <button type="submit" className="btn btn-primary">
                                {editando ? "Salvar Edição" : "Criar Produto"}
                            </button>
                            {editando && (
                                <button type="button" className="btn btn-secondary" onClick={limparForm}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="teste-lista">
                    <h2>Lista de Produtos</h2>

                    {carregando && <p>Carregando...</p>}
                    {erro && <p className="erro">Erro: {erro}</p>}

                    {produtos && produtos.length > 0 ? (
                        <div className="tabela-scroll">
                            <table className="tabela">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Preço</th>
                                    <th>Categoria</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {produtos.map((p) => (
                                    <tr key={p.id} className={!p.disponibilidade ? "inativo" : ""}>
                                        <td>{p.id}</td>
                                        <td>{p.nome}</td>
                                        <td>R$ {Number(p.preco).toFixed(2)}</td>
                                        <td>{p.categoria}</td>
                                        <td>
                                                <span
                                                    className={`badge ${p.disponibilidade ? "badge-ativo" : "badge-inativo"}`}
                                                >
                                                    {p.disponibilidade ? "Ativo" : "Inativo"}
                                                </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-small btn-edit"
                                                onClick={() => handleEditar(p)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            {p.disponibilidade && (
                                                <button
                                                    className="btn btn-small btn-delete"
                                                    onClick={() => handleDeletar(p.id!)}
                                                >
                                                    🗑️ Deletar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Nenhum produto encontrado</p>
                    )}
                </div>
            </div>
        </div>
    );
}