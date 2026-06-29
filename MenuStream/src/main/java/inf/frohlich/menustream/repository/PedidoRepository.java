package inf.frohlich.menustream.repository;

import inf.frohlich.menustream.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}