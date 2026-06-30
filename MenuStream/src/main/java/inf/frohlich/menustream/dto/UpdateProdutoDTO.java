package inf.frohlich.menustream.dto;

import java.math.BigDecimal;

public record UpdateProdutoDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        String categoria,
        Boolean disponibilidade,
        String imagem
) {}