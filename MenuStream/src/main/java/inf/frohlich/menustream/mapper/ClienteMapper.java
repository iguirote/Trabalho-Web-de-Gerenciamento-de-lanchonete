package inf.frohlich.menustream.mapper;

import inf.frohlich.menustream.dto.ClienteDTORequest;
import inf.frohlich.menustream.dto.ClienteDTOResponse;
import inf.frohlich.menustream.model.Cliente;

import java.util.List;

public class ClienteMapper {

    private ClienteMapper() {}

    public static Cliente toEntity(ClienteDTORequest dto) {
        if (dto == null) return null;
        return new Cliente(dto.nome(), dto.email(), dto.enderecoEntrega(), dto.preferenciaPagamento());
    }

    public static ClienteDTOResponse toResponse(Cliente cliente) {
        if (cliente == null) return null;
        return new ClienteDTOResponse(cliente.getId(), cliente.getNome(), cliente.getEmail(),
                cliente.getEnderecoEntrega(), cliente.getPreferenciaPagamento());
    }

    public static List<ClienteDTOResponse> toResponseList(List<Cliente> clientes) {
        if (clientes == null) return List.of();
        return clientes.stream().map(ClienteMapper::toResponse).toList();
    }
}