package inf.frohlich.menustream.mapper;

import inf.frohlich.menustream.dto.ItemPedidoDTOResponse;
import inf.frohlich.menustream.model.ItemPedido;
import java.math.BigDecimal;

public class ItemPedidoMapper {

    private ItemPedidoMapper() {}

    public static ItemPedidoDTOResponse toResponse(ItemPedido itemPedido) {
        if (itemPedido == null) return null;

        /* Calcula o subtotal do item: preço * quantidade */
        BigDecimal subtotal = itemPedido.getProduto().getPreco()
                .multiply(BigDecimal.valueOf(itemPedido.getQuantidade()));

        return new ItemPedidoDTOResponse(
                itemPedido.getProduto().getId(),
                itemPedido.getProduto().getNome(),
                itemPedido.getProduto().getPreco(),
                itemPedido.getQuantidade(),
                subtotal
        );
    }
}