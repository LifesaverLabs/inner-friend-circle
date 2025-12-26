import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * ResponsiveDialog - Uses Drawer on mobile, Dialog on desktop
 * Provides a better mobile UX with bottom sheet behavior
 */
const ResponsiveDialog = ({ children, open, onOpenChange }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
};

const ResponsiveDialogTrigger = ({
  children,
  className,
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const isMobile = useIsMobile();
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <Trigger className={className} asChild={asChild}>
      {children}
    </Trigger>
  );
};

const ResponsiveDialogContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent className={cn("max-h-[85vh]", className)}>
        <div className="overflow-y-auto px-4 pb-4">{children}</div>
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={cn("max-h-[85vh] overflow-y-auto", className)}>
      {children}
    </DialogContent>
  );
};

const ResponsiveDialogHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const Header = isMobile ? DrawerHeader : DialogHeader;

  return <Header className={className}>{children}</Header>;
};

const ResponsiveDialogFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return <Footer className={className}>{children}</Footer>;
};

const ResponsiveDialogTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const Title = isMobile ? DrawerTitle : DialogTitle;

  return <Title className={className}>{children}</Title>;
};

const ResponsiveDialogDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const Description = isMobile ? DrawerDescription : DialogDescription;

  return <Description className={className}>{children}</Description>;
};

const ResponsiveDialogClose = ({
  children,
  className,
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const isMobile = useIsMobile();
  const Close = isMobile ? DrawerClose : DialogClose;

  return (
    <Close className={className} asChild={asChild}>
      {children}
    </Close>
  );
};

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
};
