package inf.frohlich.menustream.controller;

import inf.frohlich.menustream.dto.PedidoDTORequest;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.dto.UpdatePedidoDTO;
import inf.frohlich.menustream.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    /* Cliente envia um novo pedido (rodada de itens) para uma comanda */
    @PostMapping
    public ResponseEntity<PedidoDTOResponse> salvar(@RequestBody PedidoDTORequest dto) {
        PedidoDTOResponse response = pedidoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /* Admin atualiza um pedido existente (trocar itens, quantidades) */
    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTOResponse> atualizar(@PathVariable Long id, @RequestBody UpdatePedidoDTO dto) {
        UpdatePedidoDTO dtoComId = new UpdatePedidoDTO(id, dto.comandaNumero(), dto.itensPedido());
        return ResponseEntity.ok(pedidoService.atualizar(id, dtoComId));
    }

    /* Lista todos os pedidos do sistema (uso geral/admin) */
    @GetMapping
    public List<PedidoDTOResponse> listar() {
        return pedidoService.listar();
    }

    /* Histórico geral: todos os pedidos já pagos, de qualquer comanda — usado na aba Histórico do admin */
    @GetMapping("/historico")
    public List<PedidoDTOResponse> listarHistorico() {
        return pedidoService.listarHistorico();
    }

    /* Todos os pedidos em aberto (pago = false) do sistema — usado pros "chips" de
     * comandas abertas na aba Comandas, pra não sumir uma comanda só porque os
     * pedidos dela já foram todos visualizados. */
    @GetMapping("/abertos")
    public List<PedidoDTOResponse> listarAbertos() {
        return pedidoService.listarAbertos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTOResponse> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* Histórico completo de pedidos de uma comanda (visão do atendente, em ordem cronológica) */
    @GetMapping("/comanda/{comandaId}")
    public List<PedidoDTOResponse> listarPorComanda(@PathVariable Long comandaId) {
        return pedidoService.listarPorComanda(comandaId);
    }

    /* Apenas os pedidos novos de uma comanda específica, ainda não vistos pelo atendente */
    @GetMapping("/comanda/{comandaId}/novidades")
    public List<PedidoDTOResponse> listarNovidades(@PathVariable Long comandaId) {
        return pedidoService.listarNovidades(comandaId);
    }

    /* Painel central: todas as novidades do sistema, de qualquer comanda — usado no polling da tela inicial do atendente */
    @GetMapping("/novidades")
    public List<PedidoDTOResponse> listarTodasNovidades() {
        return pedidoService.listarTodasNovidades();
    }

    /* Atendente marca o pedido como visto, removendo o destaque de "novidade" */
    @PatchMapping("/{id}/visualizar")
    public ResponseEntity<Void> marcarComoVisualizado(@PathVariable Long id) {
        try {
            pedidoService.marcarComoVisualizado(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}