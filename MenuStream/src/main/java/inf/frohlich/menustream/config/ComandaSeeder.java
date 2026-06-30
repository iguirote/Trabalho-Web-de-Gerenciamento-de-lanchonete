package inf.frohlich.menustream.config;

import inf.frohlich.menustream.model.Comanda;
import inf.frohlich.menustream.model.StatusComanda;
import inf.frohlich.menustream.repository.ComandaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ComandaSeeder implements CommandLineRunner {

    private final ComandaRepository comandaRepository;

    public ComandaSeeder(ComandaRepository comandaRepository) {
        this.comandaRepository = comandaRepository;
    }

    // Executa automaticamente uma vez, toda vez que a aplicação inicia.
    // Só cria as comandas se o banco ainda estiver vazio, para não duplicar.
    @Override
    public void run(String... args) {
        if (comandaRepository.count() == 0) {
            for (int numero = 1; numero <= 100; numero++) {
                comandaRepository.save(new Comanda(numero, StatusComanda.LIVRE));
            }
            System.out.println("100 comandas criadas com sucesso.");
        }
    }
}