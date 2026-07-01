package inf.frohlich.menustream.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comanda_id", nullable = false)
    private Comanda comanda;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itensPedido = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;


    @Column(nullable = false)
    private LocalDateTime dataPedido;

    @Column(nullable = false)
    private boolean visualizado = false;

    @Column(nullable = false)
    private boolean pago = false;

    public Pedido() {}

    public Pedido(Comanda comanda, List<ItemPedido> itensPedido, BigDecimal valorTotal,
                  LocalDateTime dataPedido) {
        this.comanda = comanda;
        this.itensPedido = itensPedido;
        this.valorTotal = valorTotal;
        this.dataPedido = dataPedido;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Comanda getComanda() { return comanda; }
    public void setComanda(Comanda comanda) { this.comanda = comanda; }
    public List<ItemPedido> getItensPedido() { return itensPedido; }
    public void setItensPedido(List<ItemPedido> itensPedido) { this.itensPedido = itensPedido; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }
    public boolean isVisualizado() { return visualizado; }
    public void setVisualizado(boolean visualizado) { this.visualizado = visualizado; }
    public boolean isPago() { return pago; }
    public void setPago(boolean pago) { this.pago = pago; }
}