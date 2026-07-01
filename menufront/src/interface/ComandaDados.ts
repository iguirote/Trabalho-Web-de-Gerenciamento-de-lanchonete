export type StatusComanda = "LIVRE" | "OCUPADA";

export interface ComandaDados {
    id: number;
    numero: number;
    status: StatusComanda;
}