import { useMemo, useState } from "react";
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

import type { ComandaDados } from "../interface/ComandaDados";
import type { ProdutoDados } from "../interface/ProdutoDados";
import type { PedidoDados, ItemPedidoDados } from "../interface/PedidoDados";

import { useComandaBuscar } from "../hooks/useComandaBuscar";
import { useComandaEntrar } from "../hooks/useComandaEntrar";
import { useComandaFechar } from "../hooks/useComandaFechar";
import { usePedidoCriar, type ItemPedidoRequest } from "../hooks/usePedidoCriar";
import { usePedidoHistorico } from "../hooks/usePedidoHistorico";
import { usePedidoHistoricoGeral } from "../hooks/usePedidoHistoricoGeral";
import { usePedidoNovidades } from "../hooks/usePedidoNovidades";
import { usePedidoAbertos } from "../hooks/usePedidoAbertos";
import { usePedidoVisualizar } from "../hooks/usePedidoVisualizar";
import { useProdutoAtivos } from "../hooks/useProdutoAtivos";
import { useProdutoCriar, type ProdutoRequest } from "../hooks/useProdutoCriar";
import { useProdutoDados } from "../hooks/useProdutoDados";
import { useProdutoDesativar } from "../hooks/useProdutoDestaviar";
import { useProdutoEditar, type ProdutoEditarRequest } from "../hooks/useProdutoEditar";

import LoginView from "./views/LoginView";
import ClienteEntradaStep from "./views/cliente/ClienteEntradaStep";
import ClienteMenuStep from "./views/cliente/ClienteMenuStep";
import ClienteSucessoStep from "./views/cliente/ClienteSucessoStep";
import AdminLayout from "./views/admin/AdminLayout";
import AdminPedidoTab from "./views/admin/AdminPedidoTab";
import AdminComandaTab from "./views/admin/AdminComandaTab";
import AdminProdutoTab from "./views/admin/AdminProdutoTab";
import AdminHistoricoTab from "./views/admin/AdminHistoricoTab";



function produtoDadosParaProduto(p: ProdutoDados): Produto {
    return {
        id: String(p.id),
        nome: p.nome,
        preco: p.preco,
        descricao: p.descricao,
        categoria: p.categoria,
        imagem: p.imagem,
        disponibilidade: p.disponibilidade,
    };
}

function itemPedidoDadosParaItemPedido(i: ItemPedidoDados): ItemPedido {
    return {
        produtoId: String(i.produtoId),
        produtoNome: i.produtoNome,
        quantidade: i.quantidade,
        preco: i.produtoPreco,
    };
}

function pedidoDadosParaPedidoPendente(p: PedidoDados, expandido: boolean): PedidoPendente {
    return {
        id: String(p.id),
        numeroComanda: String(p.comanda.numero),
        timestamp: new Date(p.dataPedido),
        itens: p.itensPedido.map(itemPedidoDadosParaItemPedido),
        expandido,
    };
}

function pedidoDadosParaEntradaHistorico(p: PedidoDados): EntradaHistorico {
    return {
        id: String(p.id),
        numeroComanda: String(p.comanda.numero),
        timestamp: new Date(p.dataPedido),
        itens: p.itensPedido.map(itemPedidoDadosParaItemPedido),
        total: p.valorTotal,
    };
}

export default function App() {
    const [tela, setTela] = useState<View>("login");
    const [abaAdmin, setAbaAdmin] = useState<AdminTab>("pedidos");
    const [etapaCliente, setEtapaCliente] = useState<ClienteStep>("entrada");

    const produtoAtivosApi = useProdutoAtivos();
    const produtoDadosApi = useProdutoDados();
    const { criarProduto, erro: erroCriarProduto } = useProdutoCriar();
    const { editarProduto: editarProdutoApi, erro: erroEditarProduto } = useProdutoEditar();
    const { desativarProduto, erro: erroDesativarProduto } = useProdutoDesativar();

    const { entrarNaComanda, erro: erroEntrarComanda } = useComandaEntrar();
    const { fecharComanda, erro: erroFecharComanda } = useComandaFechar();
    const { buscarComanda, erro: erroBuscarComanda } = useComandaBuscar();

    const { criarPedido, erro: erroCriarPedido } = usePedidoCriar();
    const pedidoNovidadesApi = usePedidoNovidades(); // polling a cada 5s
    const pedidoAbertosApi = usePedidoAbertos(); // polling a cada 5s — "chips" de comandas abertas
    const pedidoHistoricoGeralApi = usePedidoHistoricoGeral();
    const { marcarComoVisualizado } = usePedidoVisualizar();

    const [comandaCliente, setComandaCliente] = useState("");
    const [comandaAtual, setComandaAtual] = useState<ComandaDados | null>(null);
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
    const [carrinhoMobileAberto, setCarrinhoMobileAberto] = useState(false);

    // O back não guarda "expandido" — isso é só visual, então continua local aqui,
    // independente do polling do usePedidoNovidades.
    const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

    const [formularioProduto, setFormularioProduto] = useState({
        nome: "",
        preco: "",
        descricao: "",
        categoria: "Lanches",
        imagem: ""
    });
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);

    const [comandaPesquisada, setComandaPesquisada] = useState("");
    const [comandaVisualizada, setComandaVisualizada] = useState<string | null>(null);
    const [comandaVisualizadaId, setComandaVisualizadaId] = useState<number | null>(null);

    const historicoComandaVisualizadaApi = usePedidoHistorico(comandaVisualizadaId);

    const produtosCliente = useMemo(
        () => produtoAtivosApi.produtos.map(produtoDadosParaProduto),
        [produtoAtivosApi.produtos]
    );
    const produtosAdmin = useMemo(
        () => produtoDadosApi.produtos.map(produtoDadosParaProduto),
        [produtoDadosApi.produtos]
    );

    const pedidosPendentes: PedidoPendente[] = useMemo(
        () => pedidoNovidadesApi.pedidos.map((p) => pedidoDadosParaPedidoPendente(p, !!expandidos[String(p.id)])),
        [pedidoNovidadesApi.pedidos, expandidos]
    );

    /*
     * Mapa número da comanda → id interno, montado a partir dos pedidos em
     * aberto (cada PedidoDados já vem com a ComandaDados completa). Usado só
     * como atalho pra evitar uma chamada de rede extra quando o atendente
     * clica num chip que já está na tela; a busca "de verdade" (quando o
     * número não está nesse mapa) usa o useComandaBuscar, que chama o
     * GET /comanda/{numero}.
     */
    const numeroParaIdComanda = useMemo(() => {
        const mapa: Record<string, number> = {};
        for (const p of pedidoAbertosApi.pedidos) {
            mapa[String(p.comanda.numero)] = p.comanda.id;
        }
        return mapa;
    }, [pedidoAbertosApi.pedidos]);

    const comandasAbertasChips: Record<string, ItemPedido[]> = useMemo(() => {
        const agrupado: Record<string, ItemPedido[]> = {};
        for (const p of pedidoAbertosApi.pedidos) {
            const numero = String(p.comanda.numero);
            const itens = p.itensPedido.map(itemPedidoDadosParaItemPedido);
            agrupado[numero] = [...(agrupado[numero] || []), ...itens];
        }
        return agrupado;
    }, [pedidoAbertosApi.pedidos]);

    const itensComandaVisualizada: ItemPedido[] = useMemo(
        () => historicoComandaVisualizadaApi.pedidos.flatMap((p) => p.itensPedido.map(itemPedidoDadosParaItemPedido)),
        [historicoComandaVisualizadaApi.pedidos]
    );

    const comandasAbertasParaTab: Record<string, ItemPedido[]> = useMemo(() => {
        if (!comandaVisualizada) return comandasAbertasChips;
        return { ...comandasAbertasChips, [comandaVisualizada]: itensComandaVisualizada };
    }, [comandasAbertasChips, comandaVisualizada, itensComandaVisualizada]);

    const CHAVE_HISTORICO_OCULTOS = "menustream:historico-ocultos";
    const [historicoOcultos, setHistoricoOcultos] = useState<Set<string>>(() => {
        try {
            const salvo = localStorage.getItem(CHAVE_HISTORICO_OCULTOS);
            return salvo ? new Set(JSON.parse(salvo)) : new Set();
        } catch {
            return new Set();
        }
    });
    function atualizarHistoricoOcultos(atualizar: (prev: Set<string>) => Set<string>) {
        setHistoricoOcultos((prev) => {
            const novo = atualizar(prev);
            try {
                localStorage.setItem(CHAVE_HISTORICO_OCULTOS, JSON.stringify([...novo]));
            } catch {

            }
            return novo;
        });
    }
    const historico: EntradaHistorico[] = useMemo(
        () =>
            pedidoHistoricoGeralApi.pedidos
                .filter((p) => !historicoOcultos.has(String(p.id)))
                .map(pedidoDadosParaEntradaHistorico),
        [pedidoHistoricoGeralApi.pedidos, historicoOcultos]
    );
    function removerHistorico(id: string) {
        atualizarHistoricoOcultos((prev) => new Set(prev).add(id));
    }

    function limparHistorico() {
        atualizarHistoricoOcultos((prev) => {
            const novo = new Set(prev);
            for (const p of pedidoHistoricoGeralApi.pedidos) {
                novo.add(String(p.id));
            }
            return novo;
        });
    }

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

    async function confirmarEntradaComanda() {
        const numero = parseInt(comandaCliente, 10);
        if (Number.isNaN(numero)) return;
        const resultado = await entrarNaComanda(numero);
        if (resultado) {
            setComandaAtual(resultado);
            setEtapaCliente("menu");
            produtoAtivosApi.recarregar();
        } else {
            window.alert(erroEntrarComanda ?? "Comanda inválida ou já em uso.");
        }
    }

    async function finalizarPedido() {
        if (!carrinho.length || !comandaAtual) return;
        const itensPedido: ItemPedidoRequest[] = carrinho.map((i) => ({
            produtoId: Number(i.produto.id),
            quantidade: i.quantidade,
        }));
        const resultado = await criarPedido({ comandaNumero: comandaAtual.numero, itensPedido });
        if (resultado) {
            setCarrinho([]);
            setCarrinhoMobileAberto(false);
            setEtapaCliente("sucesso");
        } else {
            window.alert(erroCriarPedido ?? "Erro ao enviar pedido.");
        }
    }

    async function finalizarPagamento(numero: string) {
        const resultado = await fecharComanda(Number(numero));
        if (resultado) {
            setComandaVisualizada(null);
            setComandaVisualizadaId(null);
            setComandaPesquisada("");
            pedidoNovidadesApi.recarregar();
            pedidoAbertosApi.recarregar();
            pedidoHistoricoGeralApi.recarregar();
        } else {
            window.alert(erroFecharComanda ?? "Erro ao fechar comanda.");
        }
    }

    function alternarPedido(id: string) {
        setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    async function entregarPedido(id: string) {
        const ok = await marcarComoVisualizado(Number(id));
        if (ok) pedidoNovidadesApi.recarregar();
    }

    /*
     * Busca/seleção de comanda na aba "Comandas" — resolve o número
     * digitado/clicado pro id interno via GET /comanda/{numero}. Se o
     * número já aparece no mapa montado a partir das novidades, usamos
     * ele primeiro (evita uma chamada de rede extra pros chips, que já
     * mostram o número na tela); senão, busca na API.
     */
    async function selecionarComandaPorNumero(numero: string) {
        setComandaPesquisada(numero);

        const idConhecido = numeroParaIdComanda[numero];
        if (idConhecido !== undefined) {
            setComandaVisualizada(numero);
            setComandaVisualizadaId(idConhecido);
            return;
        }

        const numeroInt = parseInt(numero, 10);
        if (Number.isNaN(numeroInt)) return;

        const comanda = await buscarComanda(numeroInt);
        if (comanda) {
            setComandaVisualizada(numero);
            setComandaVisualizadaId(comanda.id);
        } else {
            window.alert(erroBuscarComanda ?? "Comanda não encontrada.");
        }
    }

    async function salvarProduto() {
        if (!formularioProduto.nome || !formularioProduto.preco || !formularioProduto.descricao.trim()) return;
        const preco = parseFloat(formularioProduto.preco);

        if (idEmEdicao) {
            const dados: ProdutoEditarRequest = {
                nome: formularioProduto.nome,
                preco,
                descricao: formularioProduto.descricao,
                categoria: formularioProduto.categoria,
                imagem: formularioProduto.imagem,
            };
            const atualizado = await editarProdutoApi(Number(idEmEdicao), dados);
            if (!atualizado) {
                window.alert(erroEditarProduto ?? "Erro ao editar produto.");
                return;
            }
            setIdEmEdicao(null);
        } else {
            const dados: ProdutoRequest = {
                nome: formularioProduto.nome,
                preco,
                descricao: formularioProduto.descricao,
                categoria: formularioProduto.categoria,
                imagem: formularioProduto.imagem,
                disponibilidade: true,
            };
            const criado = await criarProduto(dados);
            if (!criado) {
                window.alert(erroCriarProduto ?? "Erro ao criar produto.");
                return;
            }
        }

        setFormularioProduto({ nome: "", preco: "", descricao: "", categoria: "Lanches", imagem: "" });
        produtoDadosApi.recarregar();
    }

    function editarProduto(p: Produto) {
        setIdEmEdicao(p.id);
        setFormularioProduto({
            nome: p.nome,
            preco: p.preco.toString(),
            descricao: p.descricao,
            categoria: p.categoria,
            imagem: p.imagem
        });
    }

    function cancelarEdicaoProduto() {
        setIdEmEdicao(null);
        setFormularioProduto({
            nome: "",
            preco: "",
            descricao: "",
            categoria: "Lanches",
            imagem: ""
        });
    }

    async function excluirProduto(produtoId: string) {
        const ok = await desativarProduto(Number(produtoId));
        if (ok) {
            produtoDadosApi.recarregar();
        } else {
            window.alert(erroDesativarProduto ?? "Erro ao desativar produto.");
        }
    }

    async function reativarProduto(produtoId: string) {
        const atualizado = await editarProdutoApi(Number(produtoId), { disponibilidade: true });
        if (atualizado) {
            produtoDadosApi.recarregar();
        } else {
            window.alert(erroEditarProduto ?? "Erro ao reativar produto.");
        }
    }

    function mudarFormularioProduto(campo: keyof typeof formularioProduto, valor: string) {
        setFormularioProduto((f) => ({ ...f, [campo]: valor }));
    }

    /* ── Valores derivados ── */
    const produtosFiltrados = categoriaSelecionada
        ? produtosCliente.filter((p) => p.categoria === categoriaSelecionada)
        : produtosCliente;

    function irParaLogin() {
        setTela("login");
        setEtapaCliente("entrada");
        setCarrinho([]);
        setComandaCliente("");
        setComandaAtual(null);
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
        setComandaAtual(null);
    }

    if (tela === "login") {
        return (
            <LoginView
                quantidadeProdutos={produtosAdmin.length}
                quantidadePedidosPendentes={pedidosPendentes.length}
                quantidadeComandasAbertas={Object.keys(comandasAbertasChips).length}
                onSelecionarAdmin={entrarComoAdmin}
                onSelecionarCliente={entrarComoCliente}
            />
        );
    }

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
                        comandasAbertas={comandasAbertasParaTab}
                        comandaPesquisada={comandaPesquisada}
                        comandaVisualizada={comandaVisualizada}
                        onChangePesquisa={setComandaPesquisada}
                        onBuscarComanda={() => comandaPesquisada.trim() && selecionarComandaPorNumero(comandaPesquisada.trim())}
                        onSelecionarComandaAberta={selecionarComandaPorNumero}
                        onFecharVisualizacao={() => {
                            setComandaVisualizada(null);
                            setComandaVisualizadaId(null);
                            setComandaPesquisada("");
                        }}
                        onImprimir={() => window.print()}
                        onFinalizarPagamento={finalizarPagamento}
                    />
                )}
                {abaAdmin === "produtos" && (
                    <AdminProdutoTab
                        produtos={produtosAdmin}
                        formulario={formularioProduto}
                        idEmEdicao={idEmEdicao}
                        onChangeFormulario={mudarFormularioProduto}
                        onSalvar={salvarProduto}
                        onEditar={editarProduto}
                        onCancelarEdicao={cancelarEdicaoProduto}
                        onExcluir={excluirProduto}
                        onReativar={reativarProduto}
                    />
                )}
                {abaAdmin === "historico" && (
                    <AdminHistoricoTab historico={historico} onRemoverEntrada={removerHistorico} onLimparHistorico={limparHistorico} />
                )}
            </AdminLayout>
        );
    }

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
                onConfirmar={confirmarEntradaComanda}
                onVoltar={irParaLogin}
            />
        );
    }

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