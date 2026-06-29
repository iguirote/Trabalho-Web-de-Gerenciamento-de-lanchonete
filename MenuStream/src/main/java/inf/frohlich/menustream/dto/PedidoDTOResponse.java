package inf.frohlich.menustream.dto;

import inf.frohlich.menustream.repository.StatusPedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoDTOResponse(Long id, ClienteDTOResponse cliente,
                                List<ItemPedidoDTOResponse> itensPedido,
                                BigDecimal valorTotal, StatusPedido status,
                                LocalDateTime dataPedido, LocalDateTime dataEntrega) {
}