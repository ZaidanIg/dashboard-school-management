import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export function Section({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
    return (
        <section id={id} className={`py-14 sm:py-20 ${className}`}>
            <Container>{children}</Container>
        </section>
    )
}

/** Subtle fade-up on first appearance. Disabled automatically for reduced-motion users. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
    const reduce = useReducedMotion()
    if (reduce) return <div className={className}>{children}</div>
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

interface SectionHeaderProps {
    eyebrow: string
    title: string
    description?: string
    align?: 'left' | 'center'
    tone?: 'light' | 'dark'
    action?: ReactNode
}

export function SectionHeader({ eyebrow, title, description, align = 'left', tone = 'light', action }: SectionHeaderProps) {
    const centered = align === 'center'
    const dark = tone === 'dark'
    return (
        <Reveal className={`mb-10 sm:mb-14 flex flex-col gap-3 ${centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
            <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
                <div className={`mb-2.5 inline-flex items-center text-xs font-bold uppercase tracking-wider ${dark ? 'text-blue-300' : 'text-blue-600'}`}>
                    <span>{eyebrow}</span>
                </div>
                <h2 className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                    {title}
                </h2>
                {description && (
                    <p className={`mt-3 text-sm sm:text-base leading-relaxed ${dark ? 'text-blue-100/80' : 'text-slate-600'}`}>{description}</p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </Reveal>
    )
}

export const levelLabel: Record<string, string> = {
    SEKOLAH: 'Tingkat Sekolah',
    KOTA: 'Tingkat Kota/Kab.',
    PROVINSI: 'Tingkat Provinsi',
    NASIONAL: 'Tingkat Nasional',
    INTERNASIONAL: 'Tingkat Internasional',
}

export const levelStyle: Record<string, string> = {
    SEKOLAH: 'bg-slate-50 text-slate-700 border-slate-200',
    KOTA: 'bg-blue-50 text-blue-700 border-blue-200',
    PROVINSI: 'bg-sky-50 text-sky-700 border-sky-200',
    NASIONAL: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    INTERNASIONAL: 'bg-blue-100 text-blue-800 border-blue-300',
}
