// 导入所需的组件和库
"use client";
import { Card, CardContent } from "@/components/ui/card"; // UI卡片组件
import Image from "next/image"; // Next.js图片组件
import { z } from "zod"; // Zod验证库
import { zodResolver } from "@hookform/resolvers/zod"; // Zod与React Hook Form集成
import { Input } from "@/components/ui/input"; // 输入框组件
import { OctagonAlertIcon } from "lucide-react"; // 警告图标
import { useForm } from "react-hook-form"; // React Hook Form核心库
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // 表单相关组件
import { Alert, AlertTitle } from "@/components/ui/alert"; // 警告提示组件
import { Button } from "@/components/ui/button"; // 按钮组件
import Link from "next/link"; // Next.js链接组件
// Next.js路由导航
import { useState } from "react"; // React状态钩子
import { authClient } from "@/lib/auth-client"; // 认证客户端
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";

// 定义表单数据验证模式
const formSchema = z.object({
  email: z.email(), // 邮箱字段，必须是有效的邮箱格式
  password: z.string().min(1, { message: "Password is required" }), // 密码字段，至少1个字符
});

// 登录页面组件
const SignInView = () => {
  const [error, setError] = useState<string | null>(null); // 错误信息状态
  const [pending, setPending] = useState(false); // 提交状态（是否正在提交）
  const router = useRouter();

  // 初始化表单，使用Zod作为验证解析器
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 表单提交处理函数
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null); // 清除之前的错误信息
    setPending(true); // 设置提交状态为正在提交

    // 调用认证客户端进行邮箱登录
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password, // 使用正确的密码字段
      },
      {
        onSuccess: () => {
          setPending(false); // 提交完成，重置状态
          router.push("/");
        },
        onError: (error) => {
          setPending(false);
          setError(error.error.message); // 设置错误信息
        },
      }
    );
  };

  const onSocial = async (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    await authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: (error) => {
          setPending(false);
          setError(error.error.message);
        },
      }
    );
  };

  return (
    // 主容器 - 垂直布局，子元素间有24px间距
    <div className="flex flex-col gap-6">
      {/* 
        flex-col: 垂直排列子元素
        gap-6: 子元素之间垂直间距为1.5rem(24px)
      */}

      {/* 登录卡片容器 - 隐藏溢出内容，无内边距 */}
      <Card className="overflow-hidden p-0">
        {/* 卡片内容 - 网格布局，在md及以上屏幕分为两列 */}
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* 
            grid: 使用网格布局
            p-0: 内边距为0
            md:grid-cols-2: 在中等屏幕及以上设备上分为两列
          */}

          {/* 表单部分 */}
          <Form {...form}>
            {/* 表单容器 - 内边距24px(md为32px)，绑定提交事件 */}
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* 
                p-6: 内边距为1.5rem(24px)
                md:p-8: 在中等屏幕及以上设备上内边距为2rem(32px)
              */}

              {/* 表单内容容器 - 垂直布局，子元素间距24px */}
              <div className="flex flex-col gap-6">
                {/* 
                  flex-col: 垂直排列子元素
                  gap-6: 子元素之间间距为1.5rem(24px)
                */}

                {/* 标题区域 - 垂直居中，文本居中 */}
                <div className="flex flex-col items-center text-center">
                  {/* 
                    flex-col: 垂直排列子元素
                    items-center: 水平居中对齐
                    text-center: 文本水平居中
                  */}
                  <h1>Welcome Back</h1>
                  {/* 描述文本 - 次要前景色，文本平衡换行 */}
                  <p className="text-muted-foreground text-balance">
                    {/* 
                      text-muted-foreground: 使用次要文本颜色
                      text-balance: 文本自动换行优化
                    */}
                    Login to your account
                  </p>
                </div>

                {/* 邮箱输入字段容器 - 网格布局，间距12px */}
                <div className="grid gap-3">
                  {/* 
                    grid: 网格布局
                    gap-3: 网格项之间间距为0.75rem(12px)
                  */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 密码输入字段容器 - 网格布局，间距12px */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*******"
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 错误提示 - 当存在错误时显示 */}
                {!!error && (
                  // 警告容器 - destructive颜色10%透明度背景，无边框
                  <Alert className="bg-destructive/10 border-none ">
                    {/* 
                      bg-destructive/10: 背景色为destructive颜色的10%透明度
                      border-none: 移除边框
                    */}

                    {/* 警告图标 - 16x16像素，destructive颜色 */}
                    <OctagonAlertIcon className="h-4 w-4 text-destructive!" />
                    {/* 
                      h-4: 高度为1rem(16px)
                      w-4: 宽度为1rem(16px)
                      text-destructive: 文字颜色为destructive颜色
                    */}

                    {/* 错误信息文本 */}
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                {/* 登录按钮 - 全宽，根据提交状态启用/禁用 */}
                <Button type="submit" className="w-full" disabled={pending}>
                  {/* 
                    w-full: 宽度占满父容器
                    disabled={pending}: 根据提交状态禁用按钮
                  */}
                  Sign in
                </Button>

                {/* 分隔线容器 - 使用伪元素实现带文字的分隔线 */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  {/* 
                    relative: 相对定位
                    text-center: 文本居中
                    text-sm: 小号字体
                    after:* : 使用伪元素创建分隔线效果
                      after:absolute: 绝对定位
                      after:inset-0: 四边都贴边
                      after:top-1/2: 垂直居中
                      after:z-0: 层级为0
                      after:flex: 弹性布局
                      after:items-center: 垂直居中对齐
                      after:border-t: 上边框
                  */}

                  {/* 分隔线文字 - 背景色为卡片背景，层级高于分隔线 */}
                  <span className="bg-card text-muted-foreground relative z-10 p-2">
                    {/* 
                      bg-card: 背景色为卡片背景色
                      text-muted-foreground: 次要文本颜色
                      relative: 相对定位
                      z-10: 层级为10，高于伪元素
                      p-2: 内边距为0.5rem(8px)
                    */}
                    Or continue with
                  </span>
                </div>

                {/* 第三方登录按钮容器 - 两列网格，间距16px */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 
                    grid: 网格布局
                    grid-cols-2: 两列网格
                    gap-4: 网格项之间间距为1rem(16px)
                  */}

                  {/* Google登录按钮 - 轮廓样式，全宽，根据提交状态启用/禁用 */}
                  <Button
                    variant={"outline"}
                    type="button"
                    className="w-full"
                    disabled={pending}
                    onClick={() => onSocial("google")}
                  >
                    <FaGoogle />
                  </Button>

                  {/* GitHub登录按钮 - 轮廓样式，全宽，根据提交状态启用/禁用 */}
                  <Button
                    variant={"outline"}
                    type="button"
                    disabled={pending}
                    className="w-full"
                    onClick={() => onSocial("github")}
                  >
                    <FaGithub />
                  </Button>
                </div>

                {/* 注册链接容器 - 文本居中，小号字体 */}
                <div className="text-center text-sm">
                  {/* 
                    text-center: 文本居中
                    text-sm: 小号字体
                  */}
                  {/* 注册提示文本 */}
                  Don&apos;t have an account?
                  {/* 注册链接 - 带下划线，下划线偏移4px */}
                  <Link
                    href={"/sign-up"}
                    className="underline underline-offset-4"
                  >
                    {/* 
                      underline: 添加下划线
                      underline-offset-4: 下划线偏移4px
                    */}
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          {/* 品牌展示区域 - 仅在md及以上屏幕显示，径向渐变背景 */}
          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col items-center justify-center gap-y-4">
            {/* 
              bg-radial: 径向渐变背景
              from-green-700: 渐变起始颜色
              to-green-900: 渐变结束颜色
              relative: 相对定位
              hidden: 默认隐藏
              md:flex: 在中等屏幕及以上设备上显示为弹性布局
              flex-col: 垂直排列子元素
              items-center: 水平居中对齐
              justify-center: 垂直居中对齐
              gap-y-4: 垂直间距为1rem(16px)
            */}

            {/* Logo图片 - 120x120像素 */}
            <Image src={"/logo1.svg"} alt="logo1" width={120} height={120} />

            {/* 品牌名称 - 大号半粗体白色文字 */}
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
            {/* 
              text-2xl: 大号字体(1.5rem)
              font-semibold: 半粗体
              text-white: 白色文字
            */}
          </div>
        </CardContent>
      </Card>

      {/* 条款链接容器 - 文本居中，超小号字体，链接悬停主色调 */}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline-offset-4">
        {/* 
          text-muted-foreground: 次要文本颜色
          *:[a]:hover:text-primary: 所有子元素中的a标签在悬停时文字颜色为主色调
          text-center: 文本居中
          text-xs: 超小号字体
          text-balance: 文本自动换行优化
          *:[a]:underline-offset-4: 所有子元素中的a标签下划线偏移4px
        */}
        {/* 条款链接文本 */}
        By clicking continue ,you agree to our <a href="#">
          Terms of Service
        </a>{" "}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};

export default SignInView;
