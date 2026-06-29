package inf.frohlich.menustream.service;

import inf.frohlich.menustream.dto.PedidoDTORequest;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.mapper.PedidoMapper;
import inf.frohlich.menustream.model.*;
import inf.frohlich.menustream.repository.ClienteRepository;
import inf.frohlich.menustream.repository.PedidoRepository;
import inf.frohlich.menustream.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ClienteRepository clienteRepository,
                         ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    public PedidoDTOResponse salvar(PedidoDTORequest dto) {
        validar(dto);

        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente informado não existe."));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus(dto.status());
        pedido.setDataPedido(dto.dataPedido());
        pedido.setDataEntrega(dto.dataEntrega());

        List<ItemPedido> itens = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemDTO : dto.itensPedido()) {
            Produto produto = produtoRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto de id " + itemDTO.produtoId() + " não encontrado."));

            ItemPedido item = new ItemPedido(pedido, produto, itemDTO.quantidade());
            itens.add(item);
            subtotal = subtotal.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDTO.quantidade())));
        }

        // Regra de negócio: valorTotal = soma(precoProduto * quantidade) * 1.10
        pedido.setItensPedido(itens);
        pedido.setValorTotal(subtotal.multiply(new BigDecimal("1.10")).setScale(2, RoundingMode.HALF_UP));

        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    public PedidoDTOResponse atualizar(Long id, PedidoDTORequest dto) {
        validar(dto);

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));

        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente informado não existe."));

        pedido.setCliente(cliente);
        pedido.setStatus(dto.status());
        pedido.setDataPedido(dto.dataPedido());
        pedido.setDataEntrega(dto.dataEntrega());

        // Limpa os itens antigos (orphanRemoval cuida da exclusão no banco)
        pedido.getItensPedido().clear();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemDTO : dto.itensPedido()) {
            Produto produto = produtoRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto de id " + itemDTO.produtoId() + " não encontrado."));

            pedido.getItensPedido().add(new ItemPedido(pedido, produto, itemDTO.quantidade()));
            subtotal = subtotal.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDTO.quantidade())));
        }

        // Recalcula o valor total a cada atualização
        pedido.setValorTotal(subtotal.multiply(new BigDecimal("1.10")).setScale(2, RoundingMode.HALF_UP));

        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    private void validar(PedidoDTORequest dto) {
        if (dto == null) throw new IllegalArgumentException("Os dados do pedido são obrigatórios.");
        if (dto.clienteId() == null) throw new IllegalArgumentException("O cliente deve ser informado.");
        if (dto.itensPedido() == null || dto.itensPedido().isEmpty()) throw new IllegalArgumentException("O pedido deve ter pelo menos um item.");
        if (dto.status() == null) throw new IllegalArgumentException("O status do pedido deve ser informado.");
        if (dto.dataPedido() == null) throw new IllegalArgumentException("A data do pedido é obrigatória.");
    }
}