package inf.frohlich.menustream.dto;

import java.math.BigDecimal;

public record ItemPedidoDTOResponse(
        Long produtoId,
        String produtoNome,
        BigDecimal produtoPreco,
        int quantidade,
        BigDecimal subtotal
) {

}