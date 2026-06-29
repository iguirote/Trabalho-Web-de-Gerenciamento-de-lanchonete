package inf.frohlich.menustream.model;

import jakarta.persistence.*;

@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String enderecoEntrega;

    @Column(nullable = false, length = 50)
    private String preferenciaPagamento;

    public Cliente() {}

    public Cliente(String nome, String email, String enderecoEntrega, String preferenciaPagamento) {
        this.nome = nome;
        this.email = email;
        this.enderecoEntrega = enderecoEntrega;
        this.preferenciaPagamento = preferenciaPagamento;
    }

    public Cliente(long id, String nome, String email, String enderecoEntrega, String preferenciaPagamento) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.enderecoEntrega = enderecoEntrega;
        this.preferenciaPagamento = preferenciaPagamento;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEnderecoEntrega() { return enderecoEntrega; }
    public void setEnderecoEntrega(String enderecoEntrega) { this.enderecoEntrega = enderecoEntrega; }
    public String getPreferenciaPagamento() { return preferenciaPagamento; }
    public void setPreferenciaPagamento(String preferenciaPagamento) { this.preferenciaPagamento = preferenciaPagamento; }
}