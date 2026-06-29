import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProdutoDados } from "../interface/ProdutoDados";

const API_URL = "http://localhost:8080";

const buscarDados = async (): Promise<ProdutoDados[]> => {
    const response = await axios.get<ProdutoDados[]>(`${API_URL}/produtos`);
    return response.data;
};

const criarProduto = async (dto: ProdutoDados): Promise<ProdutoDados> => {
    const response = await axios.post<ProdutoDados>(`${API_URL}/produtos`, dto);
    return response.data;
};

const atualizarProduto = async (dto: ProdutoDados): Promise<ProdutoDados> => {
    const response = await axios.put<ProdutoDados>(`${API_URL}/produtos`, dto);
    return response.data;
};

const desabilitarProduto = async (id: number): Promise<ProdutoDados> => {
    const response = await axios.patch<ProdutoDados>(`${API_URL}/produtos/${id}/desabilitar`);
    return response.data;
};

export function useProdutoDados() {
    return useQuery({
        queryKey: ["produto-dados"],
        queryFn: buscarDados,
        retry: 2,
    });
}

export function useCriarProduto() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: criarProduto,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produto-dados"] }),
    });
}

export function useAtualizarProduto() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: atualizarProduto,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produto-dados"] }),
    });
}

export function useDesabilitarProduto() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: desabilitarProduto,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produto-dados"] }),
    });
}