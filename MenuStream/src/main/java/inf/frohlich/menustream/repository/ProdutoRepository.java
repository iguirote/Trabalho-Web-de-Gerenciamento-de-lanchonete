package inf.frohlich.menustream.repository;

import inf.frohlich.menustream.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}