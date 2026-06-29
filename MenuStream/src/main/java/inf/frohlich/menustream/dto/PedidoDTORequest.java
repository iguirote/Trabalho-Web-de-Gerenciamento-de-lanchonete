package inf.frohlich.menustream.dto;

import inf.frohlich.menustream.repository.StatusPedido;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoDTORequest(Long clienteId, List<inf.frohlich.menustream.dto.ItemPedidoDTORequest> itensPedido, StatusPedido status, LocalDateTime dataPedido, LocalDateTime dataEntrega) {
}