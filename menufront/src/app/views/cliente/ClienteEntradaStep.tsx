import { ChefHat, ArrowRight } from "lucide-react";

interface ClienteEntradaStepProps {
    numeroComanda: string;
    onChangeNumeroComanda: (valor: string) => void;
    onConfirmar: () => void;
    onVoltar: () => void;
}

/*
 * Extraído do App.tsx original (etapa "entrada" do clientStep).
 * Esta tela só cuida da aparência e captura o que o cliente digita.
 * O número digitado fica guardado fora daqui (no componente pai),
 * porque depois — na etapa de integração com a API — vamos precisar
 * desse valor para chamar POST /comanda/entrar e validar se o número
 * é válido (1 a 100) e se a comanda existe.
 *
 * Por isso o "value" e o "onChange" do campo de número vêm de fora,
 * via props, em vez de um useState aqui dentro: assim o componente
 * pai consegue interceptar e validar antes de avançar de tela.
 */
export default function ClienteEntradaStep({
                                               numeroComanda,
                                               onChangeNumeroComanda,
                                               onConfirmar,
                                               onVoltar,
                                           }: ClienteEntradaStepProps) {
    return (
        <div className="min-h-screen bg-background flex font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="hidden lg:flex lg:w-2/5 bg-foreground items-center justify-center p-12">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
                        <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">LanchExpress</h1>
                    <p className="text-white/40 text-base">Peça no conforto da sua mesa</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-foreground font-bold text-lg">LanchExpress</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground mb-1">Olá! 👋</h2>
                    <p className="text-muted-foreground text-sm mb-8">Informe o número da sua comanda para ver o cardápio.</p>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Número da Comanda</label>
                            <input
                                type="text"
                                placeholder="Ex: 42"
                                value={numeroComanda}
                                onChange={(e) => onChangeNumeroComanda(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && numeroComanda.trim() && onConfirmar()}
                                className="w-full px-4 py-4 rounded-xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground text-3xl font-extrabold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => numeroComanda.trim() && onConfirmar()}
                            disabled={!numeroComanda.trim()}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Ver Cardápio
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onVoltar}
                            className="w-full py-2.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}