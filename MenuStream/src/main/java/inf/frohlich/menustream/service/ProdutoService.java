package inf.frohlich.menustream.service;

import inf.frohlich.menustream.dto.ProdutoDTORequest;
import inf.frohlich.menustream.dto.ProdutoDTOResponse;
import inf.frohlich.menustream.dto.UpdateProdutoDTO;
import inf.frohlich.menustream.mapper.ProdutoMapper;
import inf.frohlich.menustream.model.Produto;
import inf.frohlich.menustream.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public ProdutoDTOResponse salvar(ProdutoDTORequest dto) {
        validar(dto);
        Produto produto = ProdutoMapper.toEntity(dto);
        Produto salvo = produtoRepository.save(produto);
        return ProdutoMapper.toResponse(salvo);
    }

    // Atualização parcial: só altera os campos que vierem preenchidos no DTO.
    public ProdutoDTOResponse atualizar(UpdateProdutoDTO dto) {
        if (dto == null || dto.id() == null) {
            throw new IllegalArgumentException("ID do produto é obrigatório.");
        }

        Produto produto = produtoRepository.findById(dto.id())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        if (dto.nome() != null && !dto.nome().isBlank()) produto.setNome(dto.nome());
        if (dto.descricao() != null && !dto.descricao().isBlank()) produto.setDescricao(dto.descricao());
        if (dto.preco() != null && dto.preco().compareTo(BigDecimal.ZERO) > 0) produto.setPreco(dto.preco());
        if (dto.categoria() != null && !dto.categoria().isBlank()) produto.setCategoria(dto.categoria());
        if (dto.disponibilidade() != null) produto.setDisponibilidade(dto.disponibilidade());
        if (dto.imagem() != null && !dto.imagem().isBlank()) produto.setImagem(dto.imagem());

        Produto atualizado = produtoRepository.save(produto);
        return ProdutoMapper.toResponse(atualizado);
    }

    // Remoção lógica: desativa o produto em vez de excluí-lo do banco.
    public void desativar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        produto.setDisponibilidade(false);
        produtoRepository.save(produto);
    }

    private void validar(ProdutoDTORequest dto) {
        if (dto == null) throw new IllegalArgumentException("Os dados do produto são obrigatórios.");
        if (dto.nome() == null || dto.nome().isBlank()) throw new IllegalArgumentException("O nome do produto é obrigatório.");
        if (dto.descricao() == null || dto.descricao().isBlank()) throw new IllegalArgumentException("A descrição do produto é obrigatória.");
        if (dto.preco() == null || dto.preco().compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("O preço deve ser maior que zero.");
        if (dto.categoria() == null || dto.categoria().isBlank()) throw new IllegalArgumentException("A categoria do produto é obrigatória.");
    }
}