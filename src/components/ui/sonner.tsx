import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      dir="rtl"
      visibleToasts={3}
      toastOptions={{
        duration: 3500,
        classNames: {
          toast:
            "group toast pointer-events-auto !rounded-2xl !border !p-4 !shadow-2xl backdrop-blur-xl " +
            "!bg-gradient-to-br !from-background/95 !to-background/80 " +
            "!text-foreground !border-primary/30 " +
            "ring-1 ring-primary/10 " +
            "data-[type=success]:!from-emerald-500/15 data-[type=success]:!to-emerald-500/5 data-[type=success]:!border-emerald-400/40 data-[type=success]:ring-emerald-400/20 " +
            "data-[type=error]:!from-rose-500/15 data-[type=error]:!to-rose-500/5 data-[type=error]:!border-rose-400/40 data-[type=error]:ring-rose-400/20 " +
            "data-[type=warning]:!from-amber-500/15 data-[type=warning]:!to-amber-500/5 data-[type=warning]:!border-amber-400/40 data-[type=warning]:ring-amber-400/20 " +
            "data-[type=info]:!from-sky-500/15 data-[type=info]:!to-sky-500/5 data-[type=info]:!border-sky-400/40 data-[type=info]:ring-sky-400/20 " +
            "animate-toast-pop",
          title: "!text-base !font-bold",
          description: "group-[.toast]:text-muted-foreground !text-sm !mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground !rounded-lg",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground !rounded-lg",
          icon: "!text-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
