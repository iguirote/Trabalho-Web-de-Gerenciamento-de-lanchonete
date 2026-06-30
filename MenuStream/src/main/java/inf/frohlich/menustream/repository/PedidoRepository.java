package inf.frohlich.menustream.repository;

import inf.frohlich.menustream.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca todos os pedidos de uma comanda específica, ordenados do mais antigo para o mais novo
    List<Pedido> findByComandaIdOrderByDataPedidoAsc(Long comandaId);

    // Busca apenas os pedidos ainda não vistos pelo atendente (a "novidade") de uma comanda específica
    List<Pedido> findByComandaIdAndVisualizadoFalse(Long comandaId);

    // Busca todas as novidades do sistema, de qualquer comanda — usado no painel central do atendente
    List<Pedido> findByVisualizadoFalseOrderByDataPedidoAsc();
}