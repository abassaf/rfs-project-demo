import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-3xl text-slate-50',
      className,
    )}
    {...props}
  />
)

export const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col px-6 pt-6', className)} {...props} />
)

export const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-2xl font-semibold tracking-tight', className)} {...props} />
)

export const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-slate-400', className)} {...props} />
)

export const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 pb-6', className)} {...props} />
)
