import {ChefHat, LogOut, Minus, Plus, ShoppingCart, Trash2, X} from "lucide-react";
import type {ItemCarrinho, Produto} from "../../types";
import {CATEGORIAS, estiloCategoria, formatarPreco} from "../../utils";

interface ClienteMenuStepProps {
    numeroComanda: string;
    produtos: Produto[];
    carrinho: ItemCarrinho[];
    categoriaSelecionada: string | null;
    carrinhoMobileAberto: boolean;
    onSelecionarCategoria: (categoria: string | null) => void;
    onAdicionarAoCarrinho: (produto: Produto) => void;
    onRemoverDoCarrinho: (produtoId: string) => void;
    onExcluirDoCarrinho: (produtoId: string) => void;
    onAbrirCarrinhoMobile: () => void;
    onFecharCarrinhoMobile: () => void;
    onFinalizarPedido: () => void;
    onVoltar: () => void;
}

/*
 * Extraído do App.tsx original (etapa "menu" do etapaCliente).
 * Esta é a tela mais movimentada do lado do cliente: mostra o cardápio,
 * deixa filtrar por categoria, e tem o carrinho (lateral no desktop,
 * em modal puxado de baixo no mobile).
 *
 * Importante: esta view não guarda o carrinho nem a lista de produtos —
 * ela só EXIBE o que vier via props e AVISA o componente pai quando o
 * cliente clica em algo (adicionar, remover, finalizar). Isso é
 * proposital: na etapa de integração, o carrinho continua sendo um
 * estado local (useState) no componente pai, mas a lista de produtos
 * vai passar a vir de GET /produto/ativos, e o "Finalizar Pedido" vai
 * disparar um POST /pedido com tudo que estiver no carrinho. Como essa
 * view não sabe de onde os dados vêm, nenhuma dessas trocas vai exigir
 * mudar este arquivo.
 */
export default function ClienteMenuStep({
                                            numeroComanda,
                                            produtos,
                                            carrinho,
                                            categoriaSelecionada,
                                            carrinhoMobileAberto,
                                            onSelecionarCategoria,
                                            onAdicionarAoCarrinho,
                                            onRemoverDoCarrinho,
                                            onExcluirDoCarrinho,
                                            onAbrirCarrinhoMobile,
                                            onFecharCarrinhoMobile,
                                            onFinalizarPedido,
                                            onVoltar,
                                        }: ClienteMenuStepProps) {
    const produtosFiltrados = categoriaSelecionada
        ? produtos.filter((p) => p.categoria === categoriaSelecionada)
        : produtos;

    const totalCarrinho = carrinho.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
    const quantidadeCarrinho = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-0 font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Navbar do cliente */}
            <nav className="bg-foreground sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <ChefHat className="w-4 h-4 text-white"/>
                            </div>
                            <span className="text-white font-bold tracking-tight">LanchExpress</span>
                        </div>
                        <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm hidden sm:block">
                Comanda <span className="text-white font-bold">#{numeroComanda}</span>
              </span>
                            <button onClick={onVoltar} className="text-white/40 hover:text-white transition-colors">
                                <LogOut className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex gap-8">
                    {/* Cardápio */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-5">
                            <h2 className="text-2xl font-extrabold text-foreground">Cardápio</h2>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                Comanda <span className="font-bold text-foreground">#{numeroComanda}</span> · Adicione
                                itens ao carrinho
                            </p>
                        </div>

                        {/* Filtros de categoria */}
                        <div className="flex gap-2 mb-6 flex-wrap">
                            <button
                                onClick={() => onSelecionarCategoria(null)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    !categoriaSelecionada ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Todos
                            </button>
                            {CATEGORIAS.filter((c) => produtos.some((p) => p.categoria === c)).map((categoria) => (
                                <button
                                    key={categoria}
                                    onClick={() => onSelecionarCategoria(categoria === categoriaSelecionada ? null : categoria)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                        categoriaSelecionada === categoria ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {categoria}
                                </button>
                            ))}
                        </div>

                        {/* Grade de produtos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {produtosFiltrados.map((produto) => {
                                const itemNoCarrinho = carrinho.find((i) => i.produto.id === produto.id);
                                const estilo = estiloCategoria[produto.categoria] || {pill: "bg-gray-100 text-gray-600"};
                                return (
                                    <div key={produto.id}
                                         className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-primary/30 hover:shadow-sm transition-all">
                                        <div>

                      <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-2 tracking-wide ${estilo.pill}`}>
                        {produto.categoria.toUpperCase()}
                      </span>
                                            <img
                                                src={produto.imagem}
                                                alt={produto.nome}
                                                className="w-full h-44 object-cover rounded-xl mb-3"
                                            />
                                            <h3 className="font-bold text-foreground leading-snug">{produto.nome}</h3>
                                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{produto.descricao}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span
                                                className="text-xl font-extrabold text-primary">{formatarPreco(produto.preco)}</span>
                                            {itemNoCarrinho ? (
                                                <div className="flex items-center gap-2.5">
                                                    <button
                                                        onClick={() => onRemoverDoCarrinho(produto.id)}
                                                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                                    >
                                                        <Minus className="w-3.5 h-3.5"/>
                                                    </button>
                                                    <span
                                                        className="w-5 text-center font-extrabold text-foreground text-sm">{itemNoCarrinho.quantidade}</span>
                                                    <button
                                                        onClick={() => onAdicionarAoCarrinho(produto)}
                                                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5"/>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => onAdicionarAoCarrinho(produto)}
                                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5"/>
                                                    Adicionar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Carrinho (versão desktop, fixo na lateral) */}
                    <div className="hidden lg:block w-80 shrink-0">
                        <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-20">
                            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-foreground"/>
                                    <h3 className="font-bold text-foreground text-sm">Seu Pedido</h3>
                                </div>
                                {quantidadeCarrinho > 0 && (
                                    <span
                                        className="bg-primary text-white text-xs font-extrabold px-2 py-0.5 rounded-full">{quantidadeCarrinho}</span>
                                )}
                            </div>
                            {carrinho.length === 0 ? (
                                <div className="py-10 text-center">
                                    <ShoppingCart className="w-7 h-7 text-muted-foreground mx-auto mb-2"/>
                                    <p className="text-muted-foreground text-xs">Seu carrinho está vazio</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
                                        {carrinho.map((item) => (
                                            <div key={item.produto.id}
                                                 className="flex items-center gap-2.5 py-1.5 border-b border-border/40 last:border-0">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-foreground truncate">{item.produto.nome}</p>
                                                    <p className="text-xs text-muted-foreground">{formatarPreco(item.produto.preco)} un.</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => onRemoverDoCarrinho(item.produto.id)}
                                                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                                                        <Minus className="w-2.5 h-2.5"/>
                                                    </button>
                                                    <span
                                                        className="w-5 text-center text-xs font-extrabold">{item.quantidade}</span>
                                                    <button onClick={() => onAdicionarAoCarrinho(item.produto)}
                                                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                                                        <Plus className="w-2.5 h-2.5"/>
                                                    </button>
                                                </div>
                                                <button onClick={() => onExcluirDoCarrinho(item.produto.id)}
                                                        className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5">
                                                    <X className="w-3.5 h-3.5"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/20">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-muted-foreground font-semibold">Total</span>
                                            <span
                                                className="font-extrabold text-base text-foreground">{formatarPreco(totalCarrinho)}</span>
                                        </div>
                                        <button
                                            onClick={onFinalizarPedido}
                                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors text-sm"
                                        >
                                            Finalizar Pedido
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra inferior mobile (abre o carrinho em modal) */}
            {carrinho.length > 0 && (
                <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
                    <button
                        onClick={onAbrirCarrinhoMobile}
                        className="w-full bg-primary text-white px-5 py-4 flex items-center justify-between shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-extrabold">{quantidadeCarrinho}</span>
                            <span className="font-semibold text-sm">Ver carrinho</span>
                        </div>
                        <span className="font-extrabold">{formatarPreco(totalCarrinho)}</span>
                    </button>
                </div>
            )}

            {/* Modal de carrinho mobile */}
            {carrinhoMobileAberto && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/50" onClick={onFecharCarrinhoMobile}/>
                    <div className="relative bg-card rounded-t-3xl flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4"/>
                                Seu Pedido
                            </h3>
                            <button onClick={onFecharCarrinhoMobile}
                                    className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {carrinho.map((item) => (
                                <div key={item.produto.id}
                                     className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{item.produto.nome}</p>
                                        <p className="text-xs text-muted-foreground">{formatarPreco(item.produto.preco)} un.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onRemoverDoCarrinho(item.produto.id)}
                                                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                                            <Minus className="w-3 h-3"/>
                                        </button>
                                        <span
                                            className="w-5 text-center text-sm font-extrabold">{item.quantidade}</span>
                                        <button onClick={() => onAdicionarAoCarrinho(item.produto)}
                                                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
                                            <Plus className="w-3 h-3"/>
                                        </button>
                                    </div>
                                    <button onClick={() => onExcluirDoCarrinho(item.produto.id)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-border bg-muted/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-foreground">Total</span>
                                <span
                                    className="font-extrabold text-xl text-foreground">{formatarPreco(totalCarrinho)}</span>
                            </div>
                            <button
                                onClick={onFinalizarPedido}
                                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}