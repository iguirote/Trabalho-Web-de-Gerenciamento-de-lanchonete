import { Search, X, ClipboardList, Printer, CheckCircle } from "lucide-react";
import type { ItemPedido } from "../../types";
import { formatarPreco } from "../../utils";

interface AdminComandasTabProps {
    comandasAbertas: Record<string, ItemPedido[]>;
    comandaPesquisada: string;
    comandaVisualizada: string | null;
    onChangePesquisa: (valor: string) => void;
    onBuscarComanda: () => void;
    onSelecionarComandaAberta: (numero: string) => void;
    onFecharVisualizacao: () => void;
    onImprimir: () => void;
    onFinalizarPagamento: (numero: string) => void;
}

/*
 * Extraído do App.tsx original (bloco abaAdmin === "comandas").
 *
 * Aqui o atendente digita o número de uma comanda (ou clica num dos
 * "chips" das comandas já abertas) e vê o extrato dela: todos os itens
 * pedidos até agora, somados, com botão de Imprimir e Finalizar Pagamento.
 *
 * Esta é a tela que vai usar o endpoint POST /comanda/{numero}/fechar
 * que você criou no back. Esse endpoint já devolve os pedidos agrupados
 * e o total geral — ou seja, o "extrato consolidado" que conversamos
 * antes (sem mostrar "Pedido 1, Pedido 2" separados, só a soma de tudo
 * que a comanda consumiu). Ao clicar em "Finalizar Pagamento", a chamada
 * a esse endpoint já limpa os pedidos da comanda e libera ela para o
 * próximo cliente, tudo em uma única requisição.
 *
 * Por enquanto esta tela ainda trabalha com o formato antigo (objeto
 * comandasAbertas guardado em memória) — isso muda só na etapa de
 * integração, sem precisar tocar no visual.
 */
export default function AdminComandaTab({
                                            comandasAbertas,
                                            comandaPesquisada,
                                            comandaVisualizada,
                                            onChangePesquisa,
                                            onBuscarComanda,
                                            onSelecionarComandaAberta,
                                            onFecharVisualizacao,
                                            onImprimir,
                                            onFinalizarPagamento,
                                        }: AdminComandasTabProps) {
    const itensComandaVisualizada = comandaVisualizada ? comandasAbertas[comandaVisualizada] || [] : [];
    const totalComandaVisualizada = itensComandaVisualizada.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-foreground">Gerenciar Comandas</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Consulte e finalize o pagamento das comandas</p>
            </div>

            <div className="max-w-md mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Número da comanda..."
                        value={comandaPesquisada}
                        onChange={(e) => onChangePesquisa(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && comandaPesquisada.trim() && onBuscarComanda()}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                    />
                    <button
                        onClick={onBuscarComanda}
                        className="px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Buscar
                    </button>
                </div>
            </div>

            {/* Chips das comandas abertas */}
            {Object.keys(comandasAbertas).length > 0 && (
                <div className="mb-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Comandas abertas</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(comandasAbertas).map((numero) => (
                            <button
                                key={numero}
                                onClick={() => onSelecionarComandaAberta(numero)}
                                className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                                    comandaVisualizada === numero
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card text-foreground hover:border-primary/50"
                                }`}
                            >
                                #{numero}
                                <span className="text-muted-foreground font-normal ml-1.5">
                  ({(comandasAbertas[numero] || []).reduce((soma, item) => soma + item.quantidade, 0)} itens)
                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {comandaVisualizada && (
                <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-xl">
                    <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-0.5">Comanda</p>
                            <h3 className="text-3xl font-extrabold text-foreground">#{comandaVisualizada}</h3>
                        </div>
                        <button onClick={onFecharVisualizacao} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {itensComandaVisualizada.length === 0 ? (
                        <div className="py-14 text-center">
                            <ClipboardList className="w-9 h-9 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm">Nenhum item nesta comanda</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-6 py-4 space-y-3">
                                {itensComandaVisualizada.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                                        <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center">
                        {item.quantidade}
                      </span>
                                            <span className="text-foreground text-sm">{item.produtoNome}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-foreground font-semibold text-sm">{formatarPreco(item.preco * item.quantidade)}</p>
                                            <p className="text-muted-foreground text-xs">{formatarPreco(item.preco)} un.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-5 bg-muted/30 border-t border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-foreground">Total</span>
                                    <span className="text-primary font-extrabold text-2xl">{formatarPreco(totalComandaVisualizada)}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onImprimir}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                                    >
                                        <Printer className="w-4 h-4" />
                                        Imprimir
                                    </button>
                                    <button
                                        onClick={() => onFinalizarPagamento(comandaVisualizada)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Finalizar Pagamento
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}