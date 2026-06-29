import { useState } from "react";
import type { ProdutoDados } from "../interface/ProdutoDados";
import "./cartaoProduto.css";

// Interface Props define que dados este componente recebe do pai
interface Props {
    produto: ProdutoDados;
    onEditar: (produto: ProdutoDados) => void;
    onDesabilitar: (id: number) => void;
    onVerDetalhes: (produto: ProdutoDados) => void;
}

export default function CartaoProduto({ produto, onEditar, onDesabilitar, onVerDetalhes }: Props) {
    const [expandido, setExpandido] = useState(false);

    return (
        <div
            className={`cartao ${!produto.disponibilidade ? "cartao--inativo" : ""} ${expandido ? "cartao--expandido" : ""}`}
            onMouseEnter={() => setExpandido(true)}
            onMouseLeave={() => setExpandido(false)}
        >
            {produto.imagem && (
                <img src={produto.imagem} alt={produto.nome} className="cartao__imagem" />
            )}
            <div className="cartao__corpo">
                <span className="cartao__categoria">{produto.categoria}</span>
                <h3 className="cartao__nome">{produto.nome}</h3>
                <p className="cartao__preco">R$ {Number(produto.preco).toFixed(2)}</p>
                <span className={`cartao__badge ${produto.disponibilidade ? "cartao__badge--ativo" : "cartao__badge--inativo"}`}>
          {produto.disponibilidade ? "Disponível" : "Indisponível"}
        </span>
            </div>
            <div className="cartao__acoes">
                <button className="btn btn--ghost" onClick={() => onVerDetalhes(produto)}>Detalhes</button>
                <button className="btn btn--primary" onClick={() => onEditar(produto)}>Editar</button>
                {produto.disponibilidade && (
                    <button className="btn btn--danger" onClick={() => onDesabilitar(produto.id!)}>Desabilitar</button>
                )}
            </div>
        </div>
    );
}
