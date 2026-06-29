package inf.frohlich.menustream.mapper;

import inf.frohlich.menustream.dto.ClienteDTOResponse;
import inf.frohlich.menustream.dto.ItemPedidoDTOResponse;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.model.Pedido;

import java.util.List;

public class PedidoMapper {

    private PedidoMapper() {}

    public static PedidoDTOResponse toResponse(Pedido pedido) {
        if (pedido == null) return null;

        ClienteDTOResponse clienteDTO = pedido.getCliente() != null ?
                new ClienteDTOResponse(
                        pedido.getCliente().getId(),
                        pedido.getCliente().getNome(),
                        pedido.getCliente().getEmail(),
                        pedido.getCliente().getEnderecoEntrega(),
                        pedido.getCliente().getPreferenciaPagamento()
                ) : null;

        List<ItemPedidoDTOResponse> itensDTO = pedido.getItensPedido().stream()
                .map(item -> new ItemPedidoDTOResponse(
                        ProdutoMapper.toResponse(item.getProduto()),
                        item.getQuantidade()
                ))
                .toList();

        return new PedidoDTOResponse(
                pedido.getId(),
                clienteDTO,
                itensDTO,
                pedido.getValorTotal(),
                pedido.getStatus(),
                pedido.getDataPedido(),
                pedido.getDataEntrega()
        );
    }

    public static List<PedidoDTOResponse> toResponseList(List<Pedido> pedidos) {
        if (pedidos == null) return List.of();
        return pedidos.stream().map(PedidoMapper::toResponse).toList();
    }
}