declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT_NO: string;
      SESSION: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
