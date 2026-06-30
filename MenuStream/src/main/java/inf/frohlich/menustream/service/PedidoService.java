package inf.frohlich.menustream.service;

import inf.frohlich.menustream.dto.PedidoDTORequest;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.dto.UpdatePedidoDTO;
import inf.frohlich.menustream.mapper.PedidoMapper;
import inf.frohlich.menustream.model.*;
import inf.frohlich.menustream.repository.ComandaRepository;
import inf.frohlich.menustream.repository.PedidoRepository;
import inf.frohlich.menustream.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ComandaRepository comandaRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ComandaRepository comandaRepository,
                         ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.comandaRepository = comandaRepository;
        this.produtoRepository = produtoRepository;
    }

    /* Cria um novo pedido (uma "rodada" de itens) vinculado a uma comanda existente */
    public PedidoDTOResponse salvar(PedidoDTORequest dto) {
        validar(dto);

        Comanda comanda = comandaRepository.findByNumero(dto.comandaNumero())
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        Pedido pedido = new Pedido();
        pedido.setComanda(comanda);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setVisualizado(false);

        List<ItemPedido> itens = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemDTO : dto.itensPedido()) {
            Produto produto = produtoRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto de id " + itemDTO.produtoId() + " não encontrado."));

            ItemPedido item = new ItemPedido(pedido, produto, itemDTO.quantidade());
            itens.add(item);
            subtotal = subtotal.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDTO.quantidade())));
        }

        pedido.setItensPedido(itens);
        pedido.setValorTotal(subtotal.setScale(2, RoundingMode.HALF_UP));

        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    /* Atualiza um pedido existente (trocar itens, quantidades) */
    public PedidoDTOResponse atualizar(Long id, UpdatePedidoDTO dto) {
        validar(dto);

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));

        Comanda comanda = comandaRepository.findByNumero(dto.comandaNumero())
                .orElseThrow(() -> new IllegalArgumentException("Comanda não encontrada."));

        pedido.setComanda(comanda);

        /* Limpa itens antigos — orphanRemoval cuida da exclusão no banco */
        pedido.getItensPedido().clear();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemDTO : dto.itensPedido()) {
            Produto produto = produtoRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto de id " + itemDTO.produtoId() + " não encontrado."));

            pedido.getItensPedido().add(new ItemPedido(pedido, produto, itemDTO.quantidade()));
            subtotal = subtotal.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDTO.quantidade())));
        }

        /* Recalcula o valor total */
        pedido.setValorTotal(subtotal.setScale(2, RoundingMode.HALF_UP));

        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    public List<PedidoDTOResponse> listar() {
        return PedidoMapper.toResponseList(pedidoRepository.findAll());
    }

    public PedidoDTOResponse buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .map(PedidoMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
    }

    /* Histórico de pedidos EM ABERTO de uma comanda, em ordem cronológica (extrato pro atendente).
     * Filtra pago = false: numa comanda reaproveitada, os pedidos da rodada anterior já
     * pagos não devem aparecer aqui de novo. */
    public List<PedidoDTOResponse> listarPorComanda(Long comandaId) {
        return PedidoMapper.toResponseList(pedidoRepository.findByComandaIdAndPagoFalseOrderByDataPedidoAsc(comandaId));
    }

    /* Histórico geral do sistema: todos os pedidos já pagos, do mais recente pro mais antigo */
    public List<PedidoDTOResponse> listarHistorico() {
        return PedidoMapper.toResponseList(pedidoRepository.findByPagoTrueOrderByDataPedidoDesc());
    }

    /* Apenas os pedidos ainda não vistos de uma comanda específica */
    public List<PedidoDTOResponse> listarNovidades(Long comandaId) {
        return PedidoMapper.toResponseList(pedidoRepository.findByComandaIdAndVisualizadoFalse(comandaId));
    }

    /* Todas as novidades do sistema, de qualquer comanda — usado pelo painel central do atendente */
    public List<PedidoDTOResponse> listarTodasNovidades() {
        return PedidoMapper.toResponseList(pedidoRepository.findByVisualizadoFalseOrderByDataPedidoAsc());
    }

    /* Chamado quando o atendente abre/vê o pedido — marca como visualizado */
    public void marcarComoVisualizado(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
        pedido.setVisualizado(true);
        pedidoRepository.save(pedido);
    }

    private void validar(PedidoDTORequest dto) {
        if (dto == null) throw new IllegalArgumentException("Os dados do pedido são obrigatórios.");
        if (dto.comandaNumero() == null) throw new IllegalArgumentException("O número da comanda deve ser informado.");
        if (dto.itensPedido() == null || dto.itensPedido().isEmpty()) throw new IllegalArgumentException("O pedido deve ter pelo menos um item.");
    }

    private void validar(UpdatePedidoDTO dto) {
        if (dto == null) throw new IllegalArgumentException("Os dados do pedido são obrigatórios.");
        if (dto.id() == null) throw new IllegalArgumentException("ID do pedido é obrigatório.");
        if (dto.comandaNumero() == null) throw new IllegalArgumentException("O número da comanda deve ser informado.");
        if (dto.itensPedido() == null || dto.itensPedido().isEmpty()) throw new IllegalArgumentException("O pedido deve ter pelo menos um item.");
    }
}