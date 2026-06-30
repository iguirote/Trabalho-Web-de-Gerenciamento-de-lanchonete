// Espelha o ComandaDTOResponse do back.
export type StatusComanda = "LIVRE" | "OCUPADA";

export interface ComandaDados {
    id: number;
    numero: number;
    status: StatusComanda;
}