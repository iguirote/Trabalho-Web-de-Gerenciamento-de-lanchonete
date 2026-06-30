package inf.frohlich.menustream.mapper;

import inf.frohlich.menustream.dto.ItemPedidoDTOResponse;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.model.Pedido;

import java.util.List;

public class PedidoMapper {

    private PedidoMapper() {}

    public static PedidoDTOResponse toResponse(Pedido pedido) {
        if (pedido == null) return null;

        /* Mapeia a comanda */
        var comandaDTO = pedido.getComanda() != null ?
                ComandaMapper.toResponse(pedido.getComanda()) : null;

        /* Mapeia cada item do pedido */
        List<ItemPedidoDTOResponse> itensDTO = pedido.getItensPedido().stream()
                .map(ItemPedidoMapper::toResponse)
                .toList();

        return new PedidoDTOResponse(
                pedido.getId(),
                comandaDTO,
                itensDTO,
                pedido.getValorTotal(),
                pedido.getDataPedido(),
                pedido.isVisualizado()
        );
    }

    public static List<PedidoDTOResponse> toResponseList(List<Pedido> pedidos) {
        if (pedidos == null) return List.of();
        return pedidos.stream().map(PedidoMapper::toResponse).toList();
    }
}