declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: string;
      MONGO_URI: string;
      DB_NAME: string;
    }
  }
}
