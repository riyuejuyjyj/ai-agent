// 从 nuqs 导入解析器和核心 Hook,server端使用
import { DEFAULT_PAGE } from "@/constants";

import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { MeetingStatus } from "./types";

export const filtersSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus)),
  agentId: parseAsString
    .withDefault("") // 默认值为 DEFAULT_PAGE
    .withOptions({
      clearOnDefault: true, // 如果页码是默认页（比如第 1 页），则从 URL 中移除 'page' 参数
    }),
};

export const loadSearchParams = createLoader(filtersSearchParams);
