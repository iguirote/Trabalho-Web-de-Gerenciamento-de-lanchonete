import { Check } from "lucide-react";

interface ClienteSucessoStepProps {
    numeroComanda: string;
    onFazerOutroPedido: () => void;
    onEncerrarSessao: () => void;
}


export default function ClienteSucessoStep({
                                               numeroComanda,
                                               onFazerOutroPedido,
                                               onEncerrarSessao,
                                           }: ClienteSucessoStepProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="text-center max-w-xs w-full">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground mb-2">Pedido enviado!</h2>
                <p className="text-muted-foreground text-sm mb-1">Seu pedido foi encaminhado para a cozinha.</p>
                <p className="text-muted-foreground text-sm mb-8">
                    Comanda <span className="font-bold text-foreground">#{numeroComanda}</span>
                </p>
                <div className="space-y-2.5">
                    <button
                        onClick={onFazerOutroPedido}
                        className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        Fazer mais um pedido
                    </button>
                    <button
                        onClick={onEncerrarSessao}
                        className="w-full py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-colors text-sm"
                    >
                        Encerrar sessão
                    </button>
                </div>
            </div>
        </div>
    );
}