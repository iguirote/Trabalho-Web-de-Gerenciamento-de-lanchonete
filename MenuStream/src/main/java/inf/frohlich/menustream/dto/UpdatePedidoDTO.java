package inf.frohlich.menustream.dto;

import java.util.List;

public record UpdatePedidoDTO(
        Long id,
        Integer comandaNumero,
        List<ItemPedidoDTORequest> itensPedido
) {}