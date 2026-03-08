/**
 * @file AgentForm.tsx
 * @description Agent 表单组件，支持创建和编辑 Agent
 * @features
 * - 使用 react-hook-form 进行表单管理
 * - 使用 zod 进行表单验证
 * - 使用 tRPC 进行 API 调用
 * - 支持创建和编辑两种模式
 */

import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../types";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { agentInsetSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneratedAvatar from "@/components/GeneratedAvatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/**
 * AgentForm 组件属性接口
 */
interface AgentFormProps {
  /** 成功回调函数 */
  onSuccess?: () => void;
  /** 取消回调函数 */
  onCancel?: () => void;
  /** 初始值，存在则表示编辑模式 */
  initialValues?: AgentGetOne;
}

/**
 * Agent 表单组件
 *
 * @param props - 组件属性
 * @param props.onSuccess - 提交成功后的回调
 * @param props.onCancel - 取消操作的回调
 * @param props.initialValues - 初始值，用于编辑模式
 *
 * @example
 * // 创建模式
 * <AgentForm onSuccess={() => router.refresh()} />
 *
 * @example
 * // 编辑模式
 * <AgentForm
 *   initialValues={agentData}
 *   onSuccess={() => router.refresh()}
 * />
 */
const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
  // ==================== Hooks 初始化 ====================

  /** tRPC 客户端实例，用于调用 API */
  const trpc = useTRPC();

  /** Next.js 路由实例，用于页面跳转 */
  const router = useRouter();

  /** React Query 客户端实例，用于缓存管理 */
  const queryClient = useQueryClient();

  // ==================== tRPC Mutation 配置 ====================

  /**
   * 创建 Agent 的 Mutation
   *
   * 配置说明：
   * - onSuccess: 成功时刷新相关查询缓存
   * - onError: 失败时显示错误提示
   */
  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      /**
       * 成功回调
       * - 刷新 Agent 列表查询
       * - 如果是编辑模式，刷新单个 Agent 查询
       * - 调用外部 onSuccess 回调
       * - 显示成功提示
       */
      onSuccess: () => {
        // 刷新 Agent 列表缓存
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

        // 如果是编辑模式，刷新当前 Agent 缓存
        if (initialValues?.id) {
          queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          );
        }

        // 调用外部成功回调
        onSuccess?.();

        // 显示成功提示
        toast.success("create successfully");
      },
      /**
       * 错误回调
       * @param error - 错误对象
       */
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  // ==================== 表单配置 ====================

  /**
   * react-hook-form 实例
   *
   * 配置说明：
   * - resolver: 使用 zod 进行表单验证
   * - defaultValues: 根据编辑/创建模式设置初始值
   */
  const form = useForm<z.infer<typeof agentInsetSchema>>({
    /** 验证器：将 zod schema 转换为 react-hook-form 可用的格式 */
    resolver: zodResolver(agentInsetSchema),
    /** 默认值：编辑时填充现有数据，创建时为空 */
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  // ==================== 状态计算 ====================

  /** 是否为编辑模式：存在 id 表示编辑 */
  const isEdit = !!initialValues?.id;

  /** 请求是否进行中：用于禁用表单提交 */
  const isPending = createAgent.isPending;

  // ==================== 事件处理 ====================

  /**
   * 表单提交处理函数
   *
   * @param values - 表单验证后的数据
   */
  const onSubmit = (values: z.infer<typeof agentInsetSchema>) => {
    if (isEdit) {
      // TODO: 实现更新 Agent 逻辑
      console.log("TODO:updateAgent");
    } else {
      // 创建新 Agent
      createAgent.mutate(values);
    }
  };

  // ==================== JSX 渲染 ====================

  return (
    /**
     * Form 上下文提供者
     * 将 form 实例传递给所有子表单组件
     */
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* 生成的头像预览，根据名称生成 */}
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="border size-16"
        />

        {/* 名称输入字段 */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math tutor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 指令输入字段 */}
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful math assistant that can answer questions and help with assignments"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 操作按钮区域 */}
        <div className="flex justify-between gap-2">
          {/* 取消按钮：仅在传入 onCancel 时显示 */}
          {onCancel && (
            <Button
              variant={"ghost"}
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
              className="shadow"
            >
              Cancel
            </Button>
          )}
          {/* 提交按钮：根据模式显示不同文本 */}
          <Button disabled={isPending} type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AgentForm;
