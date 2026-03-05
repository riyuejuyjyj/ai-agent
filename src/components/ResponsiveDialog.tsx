"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ResponsiveDialogProps {
  title: string;
  description: string;
  children: ReactNode;
  open: boolean;
  onOpen: (open: boolean) => void;
}

const ResponsiveDialog = ({
  title,
  description,
  children,
  open,
  onOpen,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={onOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <div className="p-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveDialog;
