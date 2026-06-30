package inf.frohlich.menustream.mapper;

import inf.frohlich.menustream.dto.ComandaDTOResponse;
import inf.frohlich.menustream.model.Comanda;

public class ComandaMapper {

    private ComandaMapper() {}

    public static ComandaDTOResponse toResponse(Comanda comanda) {
        if (comanda == null) return null;
        return new ComandaDTOResponse(comanda.getId(), comanda.getNumero(), comanda.getStatus());
    }
}