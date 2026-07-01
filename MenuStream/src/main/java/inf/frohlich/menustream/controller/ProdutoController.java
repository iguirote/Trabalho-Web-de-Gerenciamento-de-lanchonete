package inf.frohlich.menustream.controller;

import inf.frohlich.menustream.dto.ProdutoDTORequest;
import inf.frohlich.menustream.dto.ProdutoDTOResponse;
import inf.frohlich.menustream.dto.UpdateProdutoDTO;
import inf.frohlich.menustream.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produto")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    public ResponseEntity<ProdutoDTOResponse> salvar(@RequestBody ProdutoDTORequest dto) {
        ProdutoDTOResponse response = produtoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Área administrativa: lista todos os produtos (ativos e inativos)
    @GetMapping
    public List<ProdutoDTOResponse> listar() {
        return produtoService.listar();
    }

    // Área do cliente: lista apenas produtos ativos
    @GetMapping("/ativos")
    public List<ProdutoDTOResponse> listarAtivos() {
        return produtoService.listarAtivos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTOResponse> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(produtoService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTOResponse> atualizar(@PathVariable Long id, @RequestBody UpdateProdutoDTO dto) {
        UpdateProdutoDTO dtoComId = new UpdateProdutoDTO(
                id, dto.nome(), dto.descricao(),
                dto.preco(), dto.categoria(), dto.disponibilidade(), dto.imagem()
        );
        return ResponseEntity.ok(produtoService.atualizar(dtoComId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        try {
            produtoService.desativar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}