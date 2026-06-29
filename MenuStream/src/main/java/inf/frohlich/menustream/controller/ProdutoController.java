package inf.frohlich.menustream.controller;

import inf.frohlich.menustream.dto.ProdutoDTORequest;
import inf.frohlich.menustream.dto.ProdutoDTOResponse;
import inf.frohlich.menustream.dto.UpdateProdutoDTO;
import inf.frohlich.menustream.mapper.ProdutoMapper;
import inf.frohlich.menustream.repository.ProdutoRepository;
import inf.frohlich.menustream.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produto")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoRepository produtoRepository, ProdutoService produtoService) {
        this.produtoRepository = produtoRepository;
        this.produtoService = produtoService;
    }

    @PostMapping
    public ResponseEntity<ProdutoDTOResponse> salvar(@RequestBody ProdutoDTORequest dto) {
        ProdutoDTOResponse response = produtoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ProdutoDTOResponse> listar() {
        return ProdutoMapper.toResponseList(produtoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTOResponse> buscarPorId(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(ProdutoMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTOResponse> atualizar(@PathVariable Long id, @RequestBody UpdateProdutoDTO dto) {
        UpdateProdutoDTO dtoComId = new UpdateProdutoDTO(id, dto.nome(), dto.descricao(),
                dto.preco(), dto.categoria(), dto.disponibilidade(), dto.imagem());
        return ResponseEntity.ok(produtoService.atualizar(dtoComId));
    }

    // Remoção lógica: seta disponibilidade=false em vez de excluir o registro.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produtoService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}