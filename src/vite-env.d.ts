/// <reference types="vite/client" />

/** 构建信息,由 vite.config.ts 的 define 注入 */
declare const __BUILD_INFO__: {
  builtAt: string
  deps: Record<string, string>
}
