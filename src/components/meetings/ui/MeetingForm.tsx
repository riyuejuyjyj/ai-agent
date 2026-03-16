/**
 * @file AgentForm.tsx
 * @description Agent 表单组件，支持创建和编辑 Agent
 * @features
 * - 使用 react-hook-form 进行表单管理
 * - 使用 zod 进行表单验证
 * - 使用 tRPC 进行 API 调用
 * - 支持创建和编辑两种模式
 */

//8:15
import { useTRPC } from "@/trpc/client";
import type { MeetingGetOne } from "../types";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { meetingInsetSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useState } from "react";
import CommandSelect from "@/components/command-select";

import GeneratedAvatar from "@/components/GeneratedAvatar";
import NewAgentDialog from "@/components/agents/ui/NewAgentDialog";

/**
 * AgentForm 组件属性接口
 */
interface MeetingFormProps {
  /** 成功回调函数 */
  onSuccess?: (id?: string) => void;
  /** 取消回调函数 */
  onCancel?: () => void;
  /** 初始值，存在则表示编辑模式 */
  initialValues?: MeetingGetOne;
}

const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  // ==================== Hooks 初始化 ====================

  /** tRPC 客户端实例，用于调用 API */
  const trpc = useTRPC();

  const [agentSearch, setAgentSearch] = useState("");
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  /** Next.js 路由实例，用于页面跳转 */
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch }),
  );

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
  const createMeeting = useMutation(
    trpc.meeting.create.mutationOptions({
      onSuccess: async (data) => {
        // 刷新 Agent 列表缓存
        await queryClient.invalidateQueries(
          trpc.meeting.getMany.queryOptions({}),
        );

        // 如果是编辑模式，刷新当前 Agent 缓存

        // 调用外部成功回调
        onSuccess?.(data.id);

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

  const updateMeeting = useMutation(
    trpc.meeting.update.mutationOptions({
      /**
       * 成功回调
       * - 刷新 Agent 列表查询
       * - 如果是编辑模式，刷新单个 Agent 查询
       * - 调用外部 onSuccess 回调
       * - 显示成功提示
       */
      onSuccess: async () => {
        // 刷新 Agent 列表缓存
        await queryClient.invalidateQueries(
          trpc.meeting.getMany.queryOptions({}),
        );

        // 如果是编辑模式，刷新当前 Agent 缓存
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meeting.getOne.queryOptions({ id: initialValues.id }),
          );
        }

        // 调用外部成功回调
        onSuccess?.();

        // 显示成功提示
        toast.success("update successfully");
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
  const form = useForm<z.infer<typeof meetingInsetSchema>>({
    /** 验证器：将 zod schema 转换为 react-hook-form 可用的格式 */
    resolver: zodResolver(meetingInsetSchema),
    /** 默认值：编辑时填充现有数据，创建时为空 */
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  // ==================== 状态计算 ====================

  /** 是否为编辑模式：存在 id 表示编辑 */
  const isEdit = !!initialValues?.id;

  /** 请求是否进行中：用于禁用表单提交 */
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  // ==================== 事件处理 ====================

  /**
   * 表单提交处理函数
   *
   * @param values - 表单验证后的数据
   */
  const onSubmit = (values: z.infer<typeof meetingInsetSchema>) => {
    if (isEdit) {
      // TODO: 实现更新 Agent 逻辑
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      // 创建新 Agent
      createMeeting.mutate(values);
    }
  };

  // ==================== JSX 渲染 ====================

  return (
    /**
     * Form 上下文提供者
     * 将 form 实例传递给所有子表单组件
     */
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* 生成的头像预览，根据名称生成 */}

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

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for {""}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 指令输入字段 */}

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
    </>
  );
};

export default MeetingForm;
