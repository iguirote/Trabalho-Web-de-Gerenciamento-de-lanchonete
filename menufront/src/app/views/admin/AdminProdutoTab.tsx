import { Package, Trash2 } from "lucide-react";
import type { Produto } from "../../types";
import { CATEGORIAS, estiloCategoria, formatarPreco } from "../../utils";

interface FormularioProdutoState {
    nome: string;
    preco: string;
    descricao: string;
    categoria: string;
}

interface AdminProdutosTabProps {
    produtos: Produto[];
    formulario: FormularioProdutoState;
    idEmEdicao: string | null;
    onChangeFormulario: (campo: keyof FormularioProdutoState, valor: string) => void;
    onSalvar: () => void;
    onEditar: (produto: Produto) => void;
    onCancelarEdicao: () => void;
    onExcluir: (produtoId: string) => void;
}

/*
 * Extraído do App.tsx original (bloco abaAdmin === "produtos").
 *
 * Tela de cadastro de produtos: formulário fixo do lado esquerdo
 * (sticky, sempre visível ao rolar) e a lista de produtos agrupada
 * por categoria do lado direito.
 *
 * Na etapa de integração:
 * - A lista "produtos" vai vir de GET /produto (lista completa, ativos
 *   e inativos — diferente do cardápio do cliente, que usa só /ativos).
 * - "onSalvar" vai chamar POST /produto (criar) ou PUT /produto/{id}
 *   (editar), dependendo se "idEmEdicao" está preenchido ou não.
 * - "onExcluir" na verdade vai chamar DELETE /produto/{id} — mas vale
 *   lembrar que esse endpoint não apaga o produto do banco, ele só
 *   marca disponibilidade = false (é uma "exclusão lógica"). Isso é
 *   importante porque produtos desativados ainda aparecem em pedidos
 *   antigos do histórico, só não aparecem mais no cardápio do cliente.
 */
export default function AdminProdutoTab({
                                            produtos,
                                            formulario,
                                            idEmEdicao,
                                            onChangeFormulario,
                                            onSalvar,
                                            onEditar,
                                            onCancelarEdicao,
                                            onExcluir,
                                        }: AdminProdutosTabProps) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-foreground">Gerenciar Produtos</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Cadastre e edite os itens do cardápio</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Formulário */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-2xl border border-border p-6 sticky top-20">
                        <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            {idEmEdicao ? "Editar Produto" : "Novo Produto"}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Nome *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: X-Burguer Especial"
                                    value={formulario.nome}
                                    onChange={(e) => onChangeFormulario("nome", e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Preço (R$) *</label>
                                <input
                                    type="number"
                                    placeholder="0,00"
                                    value={formulario.preco}
                                    onChange={(e) => onChangeFormulario("preco", e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Categoria</label>
                                <select
                                    value={formulario.categoria}
                                    onChange={(e) => onChangeFormulario("categoria", e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                >
                                    {CATEGORIAS.map((categoria) => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Descrição</label>
                                <textarea
                                    placeholder="Ingredientes ou detalhes do produto..."
                                    value={formulario.descricao}
                                    onChange={(e) => onChangeFormulario("descricao", e.target.value)}
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                                />
                            </div>
                            <div className="flex gap-2 pt-1">
                                {idEmEdicao && (
                                    <button
                                        onClick={onCancelarEdicao}
                                        className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    onClick={onSalvar}
                                    disabled={!formulario.nome || !formulario.preco}
                                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {idEmEdicao ? "Salvar Alterações" : "Adicionar Produto"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de produtos, agrupada por categoria */}
                <div className="lg:col-span-3 space-y-6">
                    {CATEGORIAS.map((categoria) => {
                        const produtosDaCategoria = produtos.filter((p) => p.categoria === categoria);
                        if (!produtosDaCategoria.length) return null;
                        const estilo = estiloCategoria[categoria] || { pill: "bg-gray-100 text-gray-600" };
                        return (
                            <div key={categoria}>
                <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3 tracking-widest uppercase ${estilo.pill}`}>
                  {categoria}
                </span>
                                <div className="space-y-2">
                                    {produtosDaCategoria.map((produto) => (
                                        <div key={produto.id} className="bg-card rounded-xl border border-border px-4 py-3.5 flex items-center gap-4 hover:border-primary/30 transition-colors group">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-foreground text-sm truncate">{produto.nome}</p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">{produto.descricao}</p>
                                            </div>
                                            <p className="font-bold text-primary shrink-0 text-sm">{formatarPreco(produto.preco)}</p>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEditar(produto)}
                                                    className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => onExcluir(produto.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {produtos.length === 0 && (
                        <div className="py-16 text-center">
                            <Package className="w-9 h-9 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm">Nenhum produto cadastrado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}