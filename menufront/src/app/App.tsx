import { useState } from "react";
import type {
    View,
    AdminTab,
    ClienteStep,
    Produto,
    ItemCarrinho,
    ItemPedido,
    PedidoPendente,
    EntradaHistorico,
} from "./types";
import { PRODUTOS_INICIAIS, CATEGORIAS } from "./utils";

import LoginView from "./views/LoginView";
import ClienteEntradaStep from "./views/cliente/ClienteEntradaStep";
import ClienteMenuStep from "./views/cliente/ClienteMenuStep";
import ClienteSucessoStep from "./views/cliente/ClienteSucessoStep";
import AdminLayout from "./views/admin/AdminLayout";
import AdminPedidoTab from "./views/admin/AdminPedidoTab";
import AdminComandaTab from "./views/admin/AdminComandaTab";
import AdminProdutoTab from "./views/admin/AdminProdutoTab";
import AdminHistoricoTab from "./views/admin/AdminHistoricoTab";


/*
 * App.tsx — ponto central da aplicação.
 *
 * Depois da separação em componentes, este arquivo ficou com um único
 * trabalho: GUARDAR o estado (useState) e DECIDIR qual tela mostrar.
 * Ele não tem mais nenhum JSX de tela em si — só passa os dados e as
 * funções de callback para as views/tabs/steps que criamos.
 *
 * Esse é o mesmo padrão de "lifting state up" que vimos antes: como
 * várias telas diferentes (cardápio do cliente, pedidos do admin,
 * histórico) precisam ler ou alterar as mesmas informações (produtos,
 * pedidos, comandas), esse estado mora aqui, no ancestral comum a
 * todas elas, e desce para cada componente via props.
 *
 * IMPORTANTE: por enquanto, tudo aqui ainda é "fake" (useState puro,
 * sem chamar a API). A próxima etapa vai trocar cada pedaço por
 * chamadas reais ao back (GET/POST/PUT/DELETE), mas como cada view já
 * só recebe dados via props, essa troca não vai exigir mexer nas
 * views — só aqui no App.tsx.
 */

export default function App() {
    // ───────────────────────── Navegação ─────────────────────────
    const [tela, setTela] = useState<View>("login");
    const [abaAdmin, setAbaAdmin] = useState<AdminTab>("pedidos");
    const [etapaCliente, setEtapaCliente] = useState<ClienteStep>("entrada");

    // ───────────────────────── Dados "fake" (ainda sem API) ─────────────────────────
    const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
    const [comandas, setComandas] = useState<Record<string, ItemPedido[]>>({});
    const [pedidosPendentes, setPedidosPendentes] = useState<PedidoPendente[]>([]);
    const [historico, setHistorico] = useState<EntradaHistorico[]>([]);

    // ───────────────────────── Estado do cliente ─────────────────────────
    const [comandaCliente, setComandaCliente] = useState("");
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
    const [carrinhoMobileAberto, setCarrinhoMobileAberto] = useState(false);

    // ───────────────────────── Estado do formulário de produto (admin) ─────────────────────────
    const [formularioProduto, setFormularioProduto] = useState({ nome: "", preco: "", descricao: "", categoria: "Lanches" });
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);

    // ───────────────────────── Estado da busca de comanda (admin) ─────────────────────────
    const [comandaPesquisada, setComandaPesquisada] = useState("");
    const [comandaVisualizada, setComandaVisualizada] = useState<string | null>(null);

    /* ── Carrinho ─────────────────────────────────────────────────────── */
    function adicionarAoCarrinho(produto: Produto) {
        setCarrinho((prev) => {
            const existente = prev.find((i) => i.produto.id === produto.id);
            return existente
                ? prev.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i))
                : [...prev, { produto, quantidade: 1 }];
        });
    }

    function removerDoCarrinho(produtoId: string) {
        setCarrinho((prev) => {
            const existente = prev.find((i) => i.produto.id === produtoId);
            return existente && existente.quantidade > 1
                ? prev.map((i) => (i.produto.id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i))
                : prev.filter((i) => i.produto.id !== produtoId);
        });
    }

    function excluirDoCarrinho(produtoId: string) {
        setCarrinho((prev) => prev.filter((i) => i.produto.id !== produtoId));
    }

    /* ── Finalização de pedido (cliente) ─────────────────────────────────
     * Esta função vai virar a chamada POST /pedido na próxima etapa.
     * O carrinho é exatamente o que vira o "itensPedido" do
     * PedidoDTORequest que montamos no back.
     */
    function finalizarPedido() {
        if (!carrinho.length) return;
        const itens: ItemPedido[] = carrinho.map((i) => ({
            produtoId: i.produto.id,
            produtoNome: i.produto.nome,
            quantidade: i.quantidade,
            preco: i.produto.preco,
        }));
        setComandas((prev) => ({
            ...prev,
            [comandaCliente]: [...(prev[comandaCliente] || []), ...itens],
        }));
        const agora = new Date();
        const idEntrada = Date.now().toString();
        setPedidosPendentes((prev) => [
            { id: idEntrada, numeroComanda: comandaCliente, timestamp: agora, itens, expandido: false },
            ...prev,
        ]);
        setHistorico((prev) => [
            { id: idEntrada, numeroComanda: comandaCliente, timestamp: agora, itens, total: itens.reduce((s, i) => s + i.preco * i.quantidade, 0) },
            ...prev,
        ]);
        setCarrinho([]);
        setCarrinhoMobileAberto(false);
        setEtapaCliente("sucesso");
    }

    /* ── Fechamento de comanda (admin) ─────────────────────────────────
     * Vai virar a chamada POST /comanda/{numero}/fechar na próxima etapa.
     */
    function finalizarPagamento(numero: string) {
        setComandas((prev) => {
            const atualizado = { ...prev };
            delete atualizado[numero];
            return atualizado;
        });
        setComandaVisualizada(null);
        setComandaPesquisada("");
    }

    function alternarPedido(id: string) {
        setPedidosPendentes((prev) => prev.map((p) => (p.id === id ? { ...p, expandido: !p.expandido } : p)));
    }

    /* Vai virar PATCH /pedido/{id}/visualizar na próxima etapa */
    function entregarPedido(id: string) {
        setPedidosPendentes((prev) => prev.filter((p) => p.id !== id));
    }

    function removerHistorico(id: string) {
        setHistorico((prev) => prev.filter((e) => e.id !== id));
    }

    /* ── CRUD de produtos (admin) ────────────────────────────────────────
     * salvarProduto vai virar POST /produto (criar) ou PUT /produto/{id}
     * (editar, quando idEmEdicao estiver preenchido).
     */
    function salvarProduto() {
        if (!formularioProduto.nome || !formularioProduto.preco) return;
        if (idEmEdicao) {
            setProdutos((prev) =>
                prev.map((p) =>
                    p.id === idEmEdicao
                        ? { ...p, nome: formularioProduto.nome, preco: parseFloat(formularioProduto.preco), descricao: formularioProduto.descricao, categoria: formularioProduto.categoria }
                        : p
                )
            );
            setIdEmEdicao(null);
        } else {
            setProdutos((prev) => [
                ...prev,
                { id: Date.now().toString(), nome: formularioProduto.nome, preco: parseFloat(formularioProduto.preco), descricao: formularioProduto.descricao, categoria: formularioProduto.categoria },
            ]);
        }
        setFormularioProduto({ nome: "", preco: "", descricao: "", categoria: "Lanches" });
    }

    function editarProduto(p: Produto) {
        setIdEmEdicao(p.id);
        setFormularioProduto({ nome: p.nome, preco: p.preco.toString(), descricao: p.descricao, categoria: p.categoria });
    }

    function cancelarEdicaoProduto() {
        setIdEmEdicao(null);
        setFormularioProduto({ nome: "", preco: "", descricao: "", categoria: "Lanches" });
    }

    /* Vai virar DELETE /produto/{id} (remoção lógica — disponibilidade = false) */
    function excluirProduto(produtoId: string) {
        setProdutos((prev) => prev.filter((p) => p.id !== produtoId));
    }

    function mudarFormularioProduto(campo: keyof typeof formularioProduto, valor: string) {
        setFormularioProduto((f) => ({ ...f, [campo]: valor }));
    }

    /* ── Valores derivados (calculados a partir do estado, não guardados à parte) ── */
    const itensComanda = comandaVisualizada ? comandas[comandaVisualizada] || [] : [];
    const produtosFiltrados = categoriaSelecionada ? produtos.filter((p) => p.categoria === categoriaSelecionada) : produtos;

    /* ── Navegação ────────────────────────────────────────────────────── */
    function irParaLogin() {
        setTela("login");
        setEtapaCliente("entrada");
        setCarrinho([]);
        setComandaCliente("");
        setCarrinhoMobileAberto(false);
    }

    function entrarComoAdmin() {
        setTela("admin");
        setAbaAdmin("pedidos");
    }

    function entrarComoCliente() {
        setTela("cliente");
        setEtapaCliente("entrada");
        setCarrinho([]);
        setComandaCliente("");
    }

    /* ═══════════════════════════════════════════════════════════════
       LOGIN
    ═══════════════════════════════════════════════════════════════ */
    if (tela === "login") {
        return (
            <LoginView
                quantidadeProdutos={produtos.length}
                quantidadePedidosPendentes={pedidosPendentes.length}
                quantidadeComandasAbertas={Object.keys(comandas).length}
                onSelecionarAdmin={entrarComoAdmin}
                onSelecionarCliente={entrarComoCliente}
            />
        );
    }

    /* ═══════════════════════════════════════════════════════════════
       ADMIN
    ═══════════════════════════════════════════════════════════════ */
    if (tela === "admin") {
        return (
            <AdminLayout
                abaAtiva={abaAdmin}
                quantidadePedidosPendentes={pedidosPendentes.length}
                quantidadeHistorico={historico.length}
                onMudarAba={setAbaAdmin}
                onSair={irParaLogin}
            >
                {abaAdmin === "pedidos" && (
                    <AdminPedidoTab
                        pedidosPendentes={pedidosPendentes}
                        onAlternarExpandido={alternarPedido}
                        onMarcarComoEntregue={entregarPedido}
                    />
                )}
                {abaAdmin === "comandas" && (
                    <AdminComandaTab
                        comandasAbertas={comandas}
                        comandaPesquisada={comandaPesquisada}
                        comandaVisualizada={comandaVisualizada}
                        onChangePesquisa={setComandaPesquisada}
                        onBuscarComanda={() => comandaPesquisada.trim() && setComandaVisualizada(comandaPesquisada.trim())}
                        onSelecionarComandaAberta={(numero) => {
                            setComandaPesquisada(numero);
                            setComandaVisualizada(numero);
                        }}
                        onFecharVisualizacao={() => {
                            setComandaVisualizada(null);
                            setComandaPesquisada("");
                        }}
                        onImprimir={() => window.print()}
                        onFinalizarPagamento={finalizarPagamento}
                    />
                )}
                {abaAdmin === "produtos" && (
                    <AdminProdutoTab
                        produtos={produtos}
                        formulario={formularioProduto}
                        idEmEdicao={idEmEdicao}
                        onChangeFormulario={mudarFormularioProduto}
                        onSalvar={salvarProduto}
                        onEditar={editarProduto}
                        onCancelarEdicao={cancelarEdicaoProduto}
                        onExcluir={excluirProduto}
                    />
                )}
                {abaAdmin === "historico" && (
                    <AdminHistoricoTab historico={historico} onRemoverEntrada={removerHistorico} />
                )}
            </AdminLayout>
        );
    }

    /* ═══════════════════════════════════════════════════════════════
       CLIENTE
    ═══════════════════════════════════════════════════════════════ */
    if (etapaCliente === "sucesso") {
        return (
            <ClienteSucessoStep
                numeroComanda={comandaCliente}
                onFazerOutroPedido={() => {
                    setEtapaCliente("menu");
                    setCarrinho([]);
                }}
                onEncerrarSessao={irParaLogin}
            />
        );
    }

    if (etapaCliente === "entrada") {
        return (
            <ClienteEntradaStep
                numeroComanda={comandaCliente}
                onChangeNumeroComanda={setComandaCliente}
                onConfirmar={() => setEtapaCliente("menu")}
                onVoltar={irParaLogin}
            />
        );
    }

    // etapaCliente === "menu"
    return (
        <ClienteMenuStep
            numeroComanda={comandaCliente}
            produtos={produtosFiltrados}
            carrinho={carrinho}
            categoriaSelecionada={categoriaSelecionada}
            carrinhoMobileAberto={carrinhoMobileAberto}
            onSelecionarCategoria={setCategoriaSelecionada}
            onAdicionarAoCarrinho={adicionarAoCarrinho}
            onRemoverDoCarrinho={removerDoCarrinho}
            onExcluirDoCarrinho={excluirDoCarrinho}
            onAbrirCarrinhoMobile={() => setCarrinhoMobileAberto(true)}
            onFecharCarrinhoMobile={() => setCarrinhoMobileAberto(false)}
            onFinalizarPedido={finalizarPedido}
            onVoltar={irParaLogin}
        />
    );
}