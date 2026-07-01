package inf.frohlich.menustream.dto;

import java.util.List;

public record PedidoDTORequest(
        Integer comandaNumero,
        List<ItemPedidoDTORequest> itensPedido
) {}