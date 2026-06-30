package inf.frohlich.menustream.repository;

import inf.frohlich.menustream.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca os pedidos EM ABERTO (ainda não pagos) de uma comanda específica, ordenados do
    // mais antigo para o mais novo. Renomeado de findByComandaIdOrderByDataPedidoAsc: sem o
    // filtro pago = false, uma comanda reaproveitada mostraria no extrato pedidos já pagos
    // de quem sentou ali antes.
    List<Pedido> findByComandaIdAndPagoFalseOrderByDataPedidoAsc(Long comandaId);

    // Busca apenas os pedidos ainda não vistos pelo atendente (a "novidade") de uma comanda específica
    List<Pedido> findByComandaIdAndVisualizadoFalse(Long comandaId);

    // Busca todas as novidades do sistema, de qualquer comanda — usado no painel central do atendente
    List<Pedido> findByVisualizadoFalseOrderByDataPedidoAsc();

    // Histórico geral: todos os pedidos já pagos, do mais recente para o mais antigo
    List<Pedido> findByPagoTrueOrderByDataPedidoDesc();
}