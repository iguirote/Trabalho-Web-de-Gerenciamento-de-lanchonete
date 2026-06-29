import { useState } from "react";
import CartaoProduto from "./componentes/CartaoProduto";
import type { ProdutoDados } from "./interface/ProdutoDados";
import {
    useProdutoDados,
    useCriarProduto,
    useAtualizarProduto,
    useDesabilitarProduto,
} from "./hooks/useProdutoDados";
import "./App.css";

const formVazio: ProdutoDados = {
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "",
    disponibilidade: true,
    imagem: "",
};

export default function App() {
    const { data: produtos, isLoading, isError } = useProdutoDados();
    const criar = useCriarProduto();
    const atualizar = useAtualizarProduto();
    const desabilitar = useDesabilitarProduto();

    // Estados locais do componente (controlam o que aparece na tela)
    const [mostrarForm, setMostrarForm] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState<ProdutoDados | null>(null);
    const [form, setForm] = useState<ProdutoDados>(formVazio);
    const [detalhe, setDetalhe] = useState<ProdutoDados | null>(null);

    function abrirNovo() {
        setProdutoEditando(null);
        setForm(formVazio);
        setMostrarForm(true);
    }

    function abrirEditar(produto: ProdutoDados) {
        setProdutoEditando(produto);
        setForm(produto);
        setMostrarForm(true);
    }

    function fecharForm() {
        setMostrarForm(false);
        setProdutoEditando(null);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : name === "preco" ? parseFloat(value) : value,
        }));
    }

    function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        if (produtoEditando) {
            atualizar.mutate(form, { onSuccess: fecharForm });
        } else {
            criar.mutate(form, { onSuccess: fecharForm });
        }
    }

    return (
        <>
            <div className="topo">
                <h1>Cardápio</h1>
                <button className="btn-novo" onClick={abrirNovo}>+ Novo Produto</button>
            </div>

            {isLoading && <p className="mensagem">Carregando...</p>}
            {isError && <p className="mensagem mensagem--erro">Erro ao carregar produtos.</p>}

            <div className="grade-cartoes">
                {produtos?.map((p) => (
                    <CartaoProduto
                        key={p.id}
                        produto={p}
                        onEditar={abrirEditar}
                        onDesabilitar={(id) => desabilitar.mutate(id)}
                        onVerDetalhes={setDetalhe}
                    />
                ))}
            </div>

            {/* Modal formulário */}
            {mostrarForm && (
                <div className="overlay">
                    <div className="modal">
                        <h2>{produtoEditando ? "Editar Produto" : "Novo Produto"}</h2>
                        <form onSubmit={handleSalvar}>
                            {(["nome", "descricao", "categoria", "imagem"] as const).map((campo) => (
                                <div className="campo" key={campo}>
                                    <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                                    <input name={campo} value={form[campo] as string} onChange={handleChange} />
                                </div>
                            ))}
                            <div className="campo">
                                <label>Preço</label>
                                <input name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} required />
                            </div>
                            <div className="campo campo--check">
                                <label>
                                    <input name="disponibilidade" type="checkbox" checked={form.disponibilidade} onChange={handleChange} />
                                    Disponível
                                </label>
                            </div>
                            <div className="modal__acoes">
                                <button type="submit" className="btn-novo">Salvar</button>
                                <button type="button" className="btn-cancelar" onClick={fecharForm}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal detalhe */}
            {detalhe && (
                <div className="overlay">
                    <div className="modal">
                        <h2>Detalhes</h2>
                        {detalhe.imagem && <img src={detalhe.imagem} alt={detalhe.nome} className="detalhe__img" />}
                        <div className="detalhe__info">
                            <p><strong>Nome:</strong> {detalhe.nome}</p>
                            <p><strong>Descrição:</strong> {detalhe.descricao || "—"}</p>
                            <p><strong>Preço:</strong> R$ {Number(detalhe.preco).toFixed(2)}</p>
                            <p><strong>Categoria:</strong> {detalhe.categoria || "—"}</p>
                            <p><strong>Disponível:</strong> {detalhe.disponibilidade ? "Sim" : "Não"}</p>
                        </div>
                        <div className="modal__acoes">
                            <button className="btn-cancelar" onClick={() => setDetalhe(null)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
