package inf.frohlich.menustream.repository;

import inf.frohlich.menustream.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {

    // Busca a comanda pelo número físico (1 a 100) que o cliente digita
    Optional<Comanda> findByNumero(Integer numero);
}