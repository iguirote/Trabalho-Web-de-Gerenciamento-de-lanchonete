package inf.frohlich.menustream.dto;

public record UpdateClienteDTO(Long id, String nome, String email, String enderecoEntrega, String preferenciaPagamento) {
}