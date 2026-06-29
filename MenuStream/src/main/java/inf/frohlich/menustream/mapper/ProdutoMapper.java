package inf.frohlich.menustream.mapper;

import inf.frohlich.menustream.dto.ProdutoDTORequest;
import inf.frohlich.menustream.dto.ProdutoDTOResponse;
import inf.frohlich.menustream.model.Produto;

import java.util.List;

public class ProdutoMapper {

    private ProdutoMapper() {}

    public static Produto toEntity(ProdutoDTORequest dto) {
        if (dto == null) return null;
        return new Produto(dto.nome(), dto.descricao(), dto.preco(),
                dto.categoria(), dto.disponibilidade(), dto.imagem());
    }

    public static ProdutoDTOResponse toResponse(Produto produto) {
        if (produto == null) return null;
        return new ProdutoDTOResponse(produto.getId(), produto.getNome(), produto.getDescricao(),
                produto.getPreco(), produto.getCategoria(), produto.isDisponibilidade(), produto.getImagem());
    }

    public static List<ProdutoDTOResponse> toResponseList(List<Produto> produtos) {
        if (produtos == null) return List.of();
        return produtos.stream().map(ProdutoMapper::toResponse).toList();
    }
}