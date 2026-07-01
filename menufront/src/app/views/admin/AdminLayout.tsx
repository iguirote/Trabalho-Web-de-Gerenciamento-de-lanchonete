import { Bell, Receipt, Package, History, LogOut, ChefHat } from "lucide-react";
import type { AdminTab } from "../../types";

interface AdminLayoutProps {
    abaAtiva: AdminTab;
    quantidadePedidosPendentes: number;
    quantidadeHistorico: number;
    onMudarAba: (aba: AdminTab) => void;
    onSair: () => void;
    children: React.ReactNode;
}

export default function AdminLayout({
                                        abaAtiva,
                                        quantidadePedidosPendentes,
                                        quantidadeHistorico,
                                        onMudarAba,
                                        onSair,
                                        children,
                                    }: AdminLayoutProps) {
    const abas: { id: AdminTab; rotulo: string; Icone: React.ElementType }[] = [
        { id: "pedidos", rotulo: "Pedidos", Icone: Bell },
        { id: "comandas", rotulo: "Comandas", Icone: Receipt },
        { id: "produtos", rotulo: "Produtos", Icone: Package },
        { id: "historico", rotulo: "Histórico", Icone: History },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
            <nav className="bg-foreground sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-15 py-3">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    <ChefHat className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white font-bold tracking-tight">LanchExpress</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                {abas.map(({ id, rotulo, Icone }) => (
                                    <button
                                        key={id}
                                        onClick={() => onMudarAba(id)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                            abaAtiva === id ? "bg-primary text-white" : "text-white/50 hover:text-white hover:bg-white/8"
                                        }`}
                                    >
                                        <Icone className="w-3.5 h-3.5" />
                                        {rotulo}
                                        {id === "pedidos" && quantidadePedidosPendentes > 0 && (
                                            <span className="bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {quantidadePedidosPendentes}
                      </span>
                                        )}
                                        {id === "historico" && quantidadeHistorico > 0 && (
                                            <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {quantidadeHistorico}
                      </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onSair}
                            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
                {children}
            </div>
        </div>
    );
}