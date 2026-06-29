package inf.frohlich.menustream.controller;

import inf.frohlich.menustream.dto.ClienteDTORequest;
import inf.frohlich.menustream.dto.ClienteDTOResponse;
import inf.frohlich.menustream.dto.UpdateClienteDTO;
import inf.frohlich.menustream.mapper.ClienteMapper;
import inf.frohlich.menustream.repository.ClienteRepository;
import inf.frohlich.menustream.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final ClienteService clienteService;

    public ClienteController(ClienteRepository clienteRepository, ClienteService clienteService) {
        this.clienteRepository = clienteRepository;
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteDTOResponse> salvar(@RequestBody ClienteDTORequest dto) {
        ClienteDTOResponse response = clienteService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ClienteDTOResponse> listar() {
        return ClienteMapper.toResponseList(clienteRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTOResponse> buscarPorId(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(ClienteMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTOResponse> atualizar(@PathVariable Long id, @RequestBody UpdateClienteDTO dto) {
        UpdateClienteDTO dtoComId = new UpdateClienteDTO(id, dto.nome(), dto.email(),
                dto.enderecoEntrega(), dto.preferenciaPagamento());
        return ResponseEntity.ok(clienteService.atualizar(dtoComId));
    }

    // Antes de excluir, verifica se o recurso existe para devolver 404 quando necessário.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        if (!clienteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clienteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}