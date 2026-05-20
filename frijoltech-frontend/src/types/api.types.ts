export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    detalles?: { campo: string; mensaje: string }[];
  };
}
