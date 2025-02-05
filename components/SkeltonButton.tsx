import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
export function SkeltonButton({ className }: { className?: string }) {
    return (<div
        className={cn(buttonVariants({
            variant: "secondary",
        }), "pointer-events-none animate-pulse w-24",
            className
        )} >

    </div >)
}