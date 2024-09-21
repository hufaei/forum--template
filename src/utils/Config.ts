interface Config {
    baseURL: string;
  }
  
  const config: Config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL as string // 使用环境变量
  };
  
  export default config;
  