// 从常量文件导入默认页码（通常是 1）
import { DEFAULT_PAGE } from "@/constants";
// 从 nuqs 导入解析器和核心 Hook
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

/**
 * 自定义 Hook：管理智能体（Agents）列表的筛选状态
 * 包含：搜索关键词 (search) 和 当前页码 (page)
 */
export const useAgentsFilters = () => {
  return useQueryStates({
    // 1. 搜索参数
    search: parseAsString
      .withDefault("") // 默认值为空字符串
      .withOptions({
        clearOnDefault: true, // 如果搜索框为空，则从 URL 中完全移除 'search' 参数，保持 URL 整洁
      }),

    // 2. 分页参数
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE) // 默认值为 DEFAULT_PAGE
      .withOptions({
        clearOnDefault: true, // 如果页码是默认页（比如第 1 页），则从 URL 中移除 'page' 参数
      }),
  });
};
