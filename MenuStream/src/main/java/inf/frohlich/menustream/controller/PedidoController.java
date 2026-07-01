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

    @PostMapping
    public ResponseEntity<PedidoDTOResponse> salvar(@RequestBody PedidoDTORequest dto) {
        PedidoDTOResponse response = pedidoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTOResponse> atualizar(@PathVariable Long id, @RequestBody UpdatePedidoDTO dto) {
        UpdatePedidoDTO dtoComId = new UpdatePedidoDTO(id, dto.comandaNumero(), dto.itensPedido());
        return ResponseEntity.ok(pedidoService.atualizar(id, dtoComId));
    }

    @GetMapping
    public List<PedidoDTOResponse> listar() {
        return pedidoService.listar();
    }

    @GetMapping("/historico")
    public List<PedidoDTOResponse> listarHistorico() {
        return pedidoService.listarHistorico();
    }

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

    @GetMapping("/comanda/{comandaId}")
    public List<PedidoDTOResponse> listarPorComanda(@PathVariable Long comandaId) {
        return pedidoService.listarPorComanda(comandaId);
    }

    @GetMapping("/comanda/{comandaId}/novidades")
    public List<PedidoDTOResponse> listarNovidades(@PathVariable Long comandaId) {
        return pedidoService.listarNovidades(comandaId);
    }

    @GetMapping("/novidades")
    public List<PedidoDTOResponse> listarTodasNovidades() {
        return pedidoService.listarTodasNovidades();
    }

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