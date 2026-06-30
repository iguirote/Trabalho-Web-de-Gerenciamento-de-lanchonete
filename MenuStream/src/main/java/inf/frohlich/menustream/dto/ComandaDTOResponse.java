package inf.frohlich.menustream.dto;

import inf.frohlich.menustream.model.StatusComanda;

public record ComandaDTOResponse(Long id, Integer numero, StatusComanda status) {
}