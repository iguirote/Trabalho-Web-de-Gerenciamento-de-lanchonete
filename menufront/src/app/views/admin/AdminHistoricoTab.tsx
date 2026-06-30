import { History, Hash, Clock, Trash2 } from "lucide-react";
import type { EntradaHistorico } from "../../types";
import { formatarPreco } from "../../utils";

interface AdminHistoricoTabProps {
    historico: EntradaHistorico[];
    onRemoverEntrada: (entradaId: string) => void;
}

/*
 * Extraído do App.tsx original (bloco abaAdmin === "historico").
 *
 * Lista simples de consulta — mostra cada "rodada" de pedido que já
 * foi entregue/paga, com horário, itens e total. É só pra consulta,
 * diferente da aba "Comandas" que serve pra fechar conta de algo
 * ainda em aberto.
 *
 * Na integração com a API, "historico" pode vir de um GET /pedido
 * geral, filtrando os que já foram pagos — ou, dependendo de como o
 * back evoluir, de uma rota dedicada. Por enquanto a tela só recebe
 * a lista pronta via props.
 */
export default function AdminHistoricoTab({ historico, onRemoverEntrada }: AdminHistoricoTabProps) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-foreground">Histórico de Pedidos</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Consulta de pedidos já entregues e pagos</p>
            </div>

            {historico.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-18 h-18 rounded-2xl bg-muted flex items-center justify-center mb-4 p-4">
                        <History className="w-9 h-9 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">Nenhum histórico ainda</h3>
                    <p className="text-muted-foreground text-sm">Pedidos finalizados vão aparecer aqui</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {historico.map((entrada) => (
                        <div key={entrada.id} className="bg-card rounded-xl border border-border overflow-hidden">
                            <div className="px-5 py-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Hash className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-foreground">Comanda #{entrada.numeroComanda}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                                            {entrada.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                                        <span className="text-xs bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full">
                      {entrada.itens.reduce((soma, item) => soma + item.quantidade, 0)} itens
                    </span>
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                                        {entrada.itens.map((item, idx) => (
                                            <span key={idx} className="text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{item.quantidade}×</span> {item.produtoNome}
                      </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-extrabold text-primary text-sm">{formatarPreco(entrada.total)}</span>
                                    <button
                                        onClick={() => onRemoverEntrada(entrada.id)}
                                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Remover do histórico"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}