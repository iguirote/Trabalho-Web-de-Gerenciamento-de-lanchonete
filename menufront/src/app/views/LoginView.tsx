import { ChefHat, Shield, User, ArrowRight } from "lucide-react";

interface LoginViewProps {
    quantidadeProdutos: number;
    quantidadePedidosPendentes: number;
    quantidadeComandasAbertas: number;
    onSelecionarAdmin: () => void;
    onSelecionarCliente: () => void;
}

export default function LoginView({
                                      quantidadeProdutos,
                                      quantidadePedidosPendentes,
                                      quantidadeComandasAbertas,
                                      onSelecionarAdmin,
                                      onSelecionarCliente,
                                  }: LoginViewProps) {
    return (
        <div className="min-h-screen bg-background flex font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Painel esquerdo */}
            <div className="hidden lg:flex lg:w-[45%] bg-foreground flex-col justify-between p-14 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full border border-white/5" />
                <div className="absolute bottom-10 -left-20 w-64 h-64 rounded-full border border-white/5" />
                <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full border border-white/5" />
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">LanchExpress</span>
                </div>
                <div className="relative z-10">
                    <p className="text-white/40 text-sm font-semibold tracking-widest uppercase mb-4">Sistema de Gestão</p>
                    <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-5">
                        Sabor que<br />chega na hora.
                    </h1>
                    <p className="text-white/50 text-base leading-relaxed max-w-xs">
                        Pedidos, comandas e cardápio integrados em uma única plataforma.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-8">
                    <div>
                        <p className="text-white text-2xl font-bold">{quantidadeProdutos}</p>
                        <p className="text-white/40 text-xs mt-0.5">Produtos no cardápio</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                        <p className="text-white text-2xl font-bold">{quantidadePedidosPendentes}</p>
                        <p className="text-white/40 text-xs mt-0.5">Pedidos hoje</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                        <p className="text-white text-2xl font-bold">{quantidadeComandasAbertas}</p>
                        <p className="text-white/40 text-xs mt-0.5">Comandas abertas</p>
                    </div>
                </div>
            </div>

            {/* Painel direito */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-foreground font-bold text-lg">LanchExpress</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground mb-1">Bem-vindo!</h2>
                    <p className="text-muted-foreground text-sm mb-8">Selecione seu perfil para continuar.</p>
                    <div className="space-y-3">
                        <button
                            onClick={onSelecionarAdmin}
                            className="w-full p-5 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Shield className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-foreground">Administrador</p>
                                    <p className="text-muted-foreground text-xs mt-0.5">Produtos, comandas e pedidos</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </button>
                        <button
                            onClick={onSelecionarCliente}
                            className="w-full p-5 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <User className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-foreground">Cliente</p>
                                    <p className="text-muted-foreground text-xs mt-0.5">Visualizar o cardápio e fazer pedidos</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}