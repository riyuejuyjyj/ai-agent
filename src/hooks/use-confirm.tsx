import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

// 定义 useConfirm Hook，接收标题和描述作为参数
export const useConfirm = (
  title: string,
  description: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  // 状态用于存储 Promise 的 resolve 函数，控制对话框显示状态
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  // 触发确认对话框的函数，返回一个 Promise
  const confirm = () => {
    return new Promise((resolve) => {
      // 设置 promise 状态，触发对话框渲染
      setPromise({ resolve });
    });
  };

  // 关闭对话框并重置状态
  const handleClose = () => {
    setPromise(null);
  };

  // 处理用户确认操作
  const handleConfirm = () => {
    // 解析 Promise 为 true
    promise?.resolve(true);
    handleClose();
  };

  // 处理用户取消操作
  const handleCancel = () => {
    // 解析 Promise 为 false
    promise?.resolve(false);
    handleClose();
  };

  // 定义对话框组件
  const ConfirmationDialog = () => {
    return (
      <ResponsiveDialog
        // 当 promise 存在时打开对话框
        open={promise != null}
        onOpen={handleClose}
        title={title}
        description={description}
      >
        <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center">
          {/* 取消按钮 */}
          <Button
            onClick={handleCancel}
            variant={"outline"}
            className="w-full lg:w-auto"
          >
            Cancel
          </Button>

          {/* 确认按钮 */}
          <Button onClick={handleConfirm} className="w-full lg:w-auto">
            Confirm
          </Button>
        </div>
      </ResponsiveDialog>
    );
  };

  // 返回对话框组件和触发函数
  return [ConfirmationDialog, confirm];
};
