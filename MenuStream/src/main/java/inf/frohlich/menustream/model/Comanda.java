package inf.frohlich.menustream.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Comanda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Número físico da comanda, de 1 a 100. É isso que o cliente digita.
    @Column(nullable = false, unique = true)
    private Integer numero;

    // Indica se a comanda está em uso. Ajuda a evitar dois clientes usando a mesma comanda ao mesmo tempo.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusComanda status;

    // Uma comanda pode ter vários pedidos ao longo do atendimento (1 pedido por "rodada" de itens).
    @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos = new ArrayList<>();

    public Comanda() {}

    public Comanda(Integer numero, StatusComanda status) {
        this.numero = numero;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }
    public StatusComanda getStatus() { return status; }
    public void setStatus(StatusComanda status) { this.status = status; }
    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }
}