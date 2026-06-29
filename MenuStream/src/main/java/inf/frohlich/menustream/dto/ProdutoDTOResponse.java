package inf.frohlich.menustream.dto;

import java.math.BigDecimal;

public record ProdutoDTOResponse(Long id, String nome, String descricao, BigDecimal preco,
                                 String categoria, boolean disponibilidade, String imagem) {
}