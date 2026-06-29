package inf.frohlich.menustream.controller;

import inf.frohlich.menustream.dto.PedidoDTORequest;
import inf.frohlich.menustream.dto.PedidoDTOResponse;
import inf.frohlich.menustream.mapper.PedidoMapper;
import inf.frohlich.menustream.repository.PedidoRepository;
import inf.frohlich.menustream.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final PedidoService pedidoService;

    public PedidoController(PedidoRepository pedidoRepository, PedidoService pedidoService) {
        this.pedidoRepository = pedidoRepository;
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoDTOResponse> salvar(@RequestBody PedidoDTORequest dto) {
        PedidoDTOResponse response = pedidoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<PedidoDTOResponse> listar() {
        return PedidoMapper.toResponseList(pedidoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTOResponse> buscarPorId(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(PedidoMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTOResponse> atualizar(@PathVariable Long id, @RequestBody PedidoDTORequest dto) {
        return ResponseEntity.ok(pedidoService.atualizar(id, dto));
    }
}