import { Bell, Hash, Clock, ChevronDown, ChevronUp, PackageCheck } from "lucide-react";
import type { PedidoPendente } from "../../types";
import { formatarPreco } from "../../utils";

interface AdminPedidosTabProps {
    pedidosPendentes: PedidoPendente[];
    onAlternarExpandido: (pedidoId: string) => void;
    onMarcarComoEntregue: (pedidoId: string) => void;
}

export default function AdminPedidoTab({
                                           pedidosPendentes,
                                           onAlternarExpandido,
                                           onMarcarComoEntregue,
                                       }: AdminPedidosTabProps) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-foreground">Atendimento de Pedidos</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Pedidos recebidos em tempo real — clique no card para ver os itens</p>
            </div>

            {pedidosPendentes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-18 h-18 rounded-2xl bg-muted flex items-center justify-center mb-4 p-4">
                        <Bell className="w-9 h-9 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">Nenhum pedido ainda</h3>
                    <p className="text-muted-foreground text-sm">Os pedidos dos clientes aparecerão aqui automaticamente</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pedidosPendentes.map((pedido) => (
                        <div
                            key={pedido.id}
                            className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => onAlternarExpandido(pedido.id)}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Hash className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Comanda</p>
                                            <p className="text-2xl font-extrabold text-foreground leading-none mt-0.5">{pedido.numeroComanda}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                        {pedido.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                                        <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                      {pedido.itens.reduce((soma, item) => soma + item.quantidade, 0)} itens
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{pedido.expandido ? "Ocultar itens" : "Ver itens do pedido"}</span>
                                    {pedido.expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </div>
                            </div>
                            {pedido.expandido && (
                                <div className="border-t border-border bg-muted/30 px-5 py-4 space-y-2">
                                    {pedido.itens.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        <span className="font-extrabold text-primary mr-1.5">{item.quantidade}×</span>
                          {item.produtoNome}
                      </span>
                                            <span className="text-muted-foreground font-medium">{formatarPreco(item.preco * item.quantidade)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 mt-1 border-t border-border flex justify-between">
                                        <span className="font-bold text-foreground text-sm">Total</span>
                                        <span className="font-bold text-primary">
                      {formatarPreco(pedido.itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0))}
                    </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMarcarComoEntregue(pedido.id);
                                        }}
                                        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
                                    >
                                        <PackageCheck className="w-4 h-4" />
                                        Pedido Entregue
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}