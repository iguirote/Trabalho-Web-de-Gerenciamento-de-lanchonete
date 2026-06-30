/**
 * APP.TSX - ATUALIZADO PARA RODAR PÁGINA DE TESTE
 *
 * MUDANÇA: Removeu a tela antiga de produtos
 * AGORA: Renderiza TesteProdutos pra testar o backend
 */

import TesteProdutos from "./paginas/TesteProdutos";
import "./App.css";

export default function App() {
    return (
        <div className="app">
            <TesteProdutos />
        </div>
    );
}