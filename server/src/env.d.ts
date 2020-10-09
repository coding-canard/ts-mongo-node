declare namespace NodeJS {
  export interface ProcessEnv {
    SERVER_PORT: string;
    REDIS_URL: string;
    CORS_ORIGIN: string;
    ACCESS_SECRET : string;
    REFRESH_SECRET : string;
  }
}
