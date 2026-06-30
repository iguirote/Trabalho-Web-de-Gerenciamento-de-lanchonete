package inf.frohlich.menustream.repository;

import inf.frohlich.menustream.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Retorna apenas produtos ativos — usado pelo ProdutoService.listarAtivos()
    List<Produto> findByDisponibilidadeTrue();
}