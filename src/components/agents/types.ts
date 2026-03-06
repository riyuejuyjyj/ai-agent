/**
 * @file agents/types.ts
 * @description 定义 Agent 相关的类型，从 tRPC 路由自动推断
 */

// 导入 tRPC 应用路由定义，包含所有 API 端点
import { AppRouter } from "@/trpc/routers/_app";
// 导入 tRPC 类型推断工具，用于提取路由返回值的类型
import { inferRouterOutputs } from "@trpc/server";

/**
 * Agent 单个查询的返回类型
 *
 * 通过 inferRouterOutputs 从 AppRouter 自动推断类型，确保前后端类型一致
 * 推断路径：agents 路由组 -> getOne 方法 -> 返回值类型
 *
 * @example
 * // 在组件中使用
 * function AgentCard({ agent }: { agent: AgentGetOne }) {
 *   return <div>{agent.name}</div>;
 * }
 */
export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
