package inf.frohlich.menustream.controller;

import inf.frohlich.menustream.dto.ComandaDTOResponse;
import inf.frohlich.menustream.dto.EntradaComandaDTO;
import inf.frohlich.menustream.service.ComandaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/comanda")
@CrossOrigin(origins = "*")
public class ComandaController {

    private final ComandaService comandaService;

    public ComandaController(ComandaService comandaService) {
        this.comandaService = comandaService;
    }

    /* Cliente digita o número da comanda para entrar — marca como OCUPADA */
    @PostMapping("/entrar")
    public ResponseEntity<ComandaDTOResponse> entrar(@RequestBody EntradaComandaDTO dto) {
        return ResponseEntity.ok(comandaService.entrar(dto.numero()));
    }

    /* Usado ao fechar a conta — libera a comanda e retorna extrato para impressão */
    @PostMapping("/{numero}/fechar")
    public ResponseEntity<?> fechar(@PathVariable Integer numero) {
        try {
            Map<String, Object> resultado = comandaService.fecharComanda(numero);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /* Usado quando a comanda é liberada (sem fechar conta, só muda status) */
    @PostMapping("/{numero}/liberar")
    public ResponseEntity<ComandaDTOResponse> liberar(@PathVariable Integer numero) {
        return ResponseEntity.ok(comandaService.liberar(numero));
    }

    @GetMapping("/{numero}")
    public ResponseEntity<ComandaDTOResponse> buscarPorNumero(@PathVariable Integer numero) {
        try {
            return ResponseEntity.ok(comandaService.buscarPorNumero(numero));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}