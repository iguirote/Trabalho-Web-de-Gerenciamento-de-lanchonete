package inf.frohlich.menustream.service;

import inf.frohlich.menustream.dto.ComandaDTOResponse;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.mapper.ComandaMapper;
import inf.frohlich.menustream.mapper.PedidoMapper;
import inf.frohlich.menustream.model.Comanda;
import inf.frohlich.menustream.model.Pedido;
import inf.frohlich.menustream.model.StatusComanda;
import inf.frohlich.menustream.repository.ComandaRepository;
import inf.frohlich.menustream.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class ComandaService {

    private final ComandaRepository comandaRepository;
    private final PedidoRepository pedidoRepository;

    public ComandaService(ComandaRepository comandaRepository, PedidoRepository pedidoRepository) {
        this.comandaRepository = comandaRepository;
        this.pedidoRepository = pedidoRepository;
    }

    public ComandaDTOResponse entrar(Integer numero) {
        validarNumero(numero);

        Comanda comanda = comandaRepository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        comanda.setStatus(StatusComanda.OCUPADA);
        Comanda salva = comandaRepository.save(comanda);
        return ComandaMapper.toResponse(salva);
    }

    public ComandaDTOResponse liberar(Integer numero) {
        validarNumero(numero);

        Comanda comanda = comandaRepository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        comanda.setStatus(StatusComanda.LIVRE);
        Comanda salva = comandaRepository.save(comanda);
        return ComandaMapper.toResponse(salva);
    }

    public Map<String, Object> fecharComanda(Integer numero) {
        validarNumero(numero);

        Comanda comanda = comandaRepository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        List<Pedido> pedidos = comanda.getPedidos().stream()
                .filter(p -> !p.isPago())
                .toList();

        BigDecimal totalGeral = pedidos.stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PedidoDTOResponse> pedidosDTO = PedidoMapper.toResponseList(pedidos);

        for (Pedido pedido : pedidos) {
            pedido.setPago(true);
        }
        pedidoRepository.saveAll(pedidos);

        comanda.setStatus(StatusComanda.LIVRE);
        comandaRepository.save(comanda);

        return Map.of(
                "numero", numero,
                "totalGeral", totalGeral,
                "pedidos", pedidosDTO
        );
    }

    public ComandaDTOResponse buscarPorNumero(Integer numero) {
        validarNumero(numero);
        return comandaRepository.findByNumero(numero)
                .map(ComandaMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));
    }

    private void validarNumero(Integer numero) {
        if (numero == null || numero < 1 || numero > 100) {
            throw new IllegalArgumentException("Número de comanda inválido. Deve estar entre 1 e 100.");
        }
    }
}