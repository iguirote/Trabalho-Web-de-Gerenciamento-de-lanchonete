package inf.frohlich.menustream.service;

import inf.frohlich.menustream.dto.ClienteDTORequest;
import inf.frohlich.menustream.dto.ClienteDTOResponse;
import inf.frohlich.menustream.dto.UpdateClienteDTO;
import inf.frohlich.menustream.mapper.ClienteMapper;
import inf.frohlich.menustream.model.Cliente;
import inf.frohlich.menustream.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public ClienteDTOResponse salvar(ClienteDTORequest dto) {
        validar(dto);
        Cliente cliente = ClienteMapper.toEntity(dto);
        Cliente salvo = clienteRepository.save(cliente);
        return ClienteMapper.toResponse(salvo);
    }

    // Atualização parcial: só altera os campos que vierem preenchidos no DTO.
    public ClienteDTOResponse atualizar(UpdateClienteDTO dto) {
        if (dto == null || dto.id() == null) {
            throw new IllegalArgumentException("ID do cliente é obrigatório.");
        }

        Cliente cliente = clienteRepository.findById(dto.id())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        if (dto.nome() != null && !dto.nome().isBlank()) cliente.setNome(dto.nome());
        if (dto.email() != null && !dto.email().isBlank()) cliente.setEmail(dto.email());
        if (dto.enderecoEntrega() != null && !dto.enderecoEntrega().isBlank()) cliente.setEnderecoEntrega(dto.enderecoEntrega());
        if (dto.preferenciaPagamento() != null && !dto.preferenciaPagamento().isBlank()) cliente.setPreferenciaPagamento(dto.preferenciaPagamento());

        Cliente atualizado = clienteRepository.save(cliente);
        return ClienteMapper.toResponse(atualizado);
    }

    private void validar(ClienteDTORequest dto) {
        if (dto == null) throw new IllegalArgumentException("Os dados do cliente são obrigatórios.");
        if (dto.nome() == null || dto.nome().isBlank()) throw new IllegalArgumentException("O nome do cliente é obrigatório.");
        if (dto.email() == null || dto.email().isBlank()) throw new IllegalArgumentException("O e-mail do cliente é obrigatório.");
        if (dto.enderecoEntrega() == null || dto.enderecoEntrega().isBlank()) throw new IllegalArgumentException("O endereço de entrega é obrigatório.");
        if (dto.preferenciaPagamento() == null || dto.preferenciaPagamento().isBlank()) throw new IllegalArgumentException("A preferência de pagamento é obrigatória.");
    }
}