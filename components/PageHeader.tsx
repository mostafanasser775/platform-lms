import { cn } from "@/lib/utils";

export function PageHeader({ title, children, className }:
    { title: string, children?: React.ReactNode, className?: string }) {
    return (
        <div className={cn("my-4 flex gap-4 items-center justify-between", className)}>
            <h1 className="text-2xl font-semibold">
                {title}
            </h1>
            {children &&
                <div>
                    {children}

                </div>
            }
        </div>
    )
}