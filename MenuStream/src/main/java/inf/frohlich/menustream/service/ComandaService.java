package inf.frohlich.menustream.service;

import inf.frohlich.menustream.dto.ComandaDTOResponse;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.mapper.ComandaMapper;
import inf.frohlich.menustream.mapper.PedidoMapper;
import inf.frohlich.menustream.model.Comanda;
import inf.frohlich.menustream.model.Pedido;
import inf.frohlich.menustream.model.StatusComanda;
import inf.frohlich.menustream.repository.ComandaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class ComandaService {

    private final ComandaRepository comandaRepository;

    public ComandaService(ComandaRepository comandaRepository) {
        this.comandaRepository = comandaRepository;
    }

    /* Cliente digita o número (1-100) para entrar na comanda */
    public ComandaDTOResponse entrar(Integer numero) {
        validarNumero(numero);

        Comanda comanda = comandaRepository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        comanda.setStatus(StatusComanda.OCUPADA);
        Comanda salva = comandaRepository.save(comanda);
        return ComandaMapper.toResponse(salva);
    }

    /* Usado quando a comanda é fechada/paga e volta a ficar disponível */
    public ComandaDTOResponse liberar(Integer numero) {
        validarNumero(numero);

        Comanda comanda = comandaRepository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        comanda.setStatus(StatusComanda.LIVRE);
        Comanda salva = comandaRepository.save(comanda);
        return ComandaMapper.toResponse(salva);
    }

    /* Retorna todos os pedidos da comanda e depois libera ela — usado para gerar extrato/NFe antes de limpar */
    public Map<String, Object> fecharComanda(Integer numero) {
        validarNumero(numero);

        Comanda comanda = comandaRepository.findByNumero(numero)
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        /* Busca todos os pedidos — será usado para gerar extrato/NFe */
        List<Pedido> pedidos = comanda.getPedidos();

        /* Calcula total geral */
        BigDecimal totalGeral = pedidos.stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        /* Mapeia os pedidos para response (com todos os dados) */
        List<PedidoDTOResponse> pedidosDTO = PedidoMapper.toResponseList(pedidos);

        /* Limpa os pedidos da comanda — orphanRemoval deleta do BD */
        comanda.getPedidos().clear();

        /* Marca como LIVRE para próximo cliente */
        comanda.setStatus(StatusComanda.LIVRE);
        comandaRepository.save(comanda);

        /* Retorna dados para o front gerar extrato/impressão */
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