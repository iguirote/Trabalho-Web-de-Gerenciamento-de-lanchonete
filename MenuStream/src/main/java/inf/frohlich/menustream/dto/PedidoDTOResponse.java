package inf.frohlich.menustream.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoDTOResponse(
        Long id,
        ComandaDTOResponse comanda,
        List<ItemPedidoDTOResponse> itensPedido,
        BigDecimal valorTotal,
        LocalDateTime dataPedido,
        boolean visualizado,
        boolean pago
) {}