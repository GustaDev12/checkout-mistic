"use client"

import { z } from "zod"
import { Input } from "@/components/ui/input"
import { createPayment } from "../actions/payment-actions"
import { useFormSchema } from "../schema/schema"
import { useStoreUpSells } from "@/store/useCartStore"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { useRouter } from "next/navigation"
import { useState } from "react"

// Helpers: formatters keep presentation masked while form stores only digits
const onlyDigits = (v: string) => v.replace(/\D/g, "")
const formatCPF = (v: string) => {
    let digits = onlyDigits(v).slice(0, 11)
    digits = digits.replace(/(\d{3})(\d)/, "$1.$2")
    digits = digits.replace(/(\d{3})(\d)/, "$1.$2")
    digits = digits.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return digits
}
const formatBrazilPhone = (v: string) => {
    const d = onlyDigits(v).slice(0, 11)
    if (d.length <= 2) return `(${d}`
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6, 10)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
}

export default function FormIndetificacao() {
    const { form, formSchema } = useFormSchema();
    const { upSells } = useStoreUpSells();
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (loading) return null;
        setLoading(true)
        const payment_create = await createPayment({ ...data, upSells });
        if (payment_create) {
            try {
                const toPersist = {
                    internalTransactionId: payment_create.internalTransactionId,
                    providerTransactionId: payment_create.transactionId,
                    copyPaste: payment_create.copyPaste,
                    qrcodeUrl: payment_create.qrcodeUrl,
                    amount: payment_create.transactionAmount,
                    state: payment_create.transactionState,
                    method: payment_create.transactionMethod,
                    type: payment_create.transactionType,
                    fee: payment_create.transactionFee,
                    payer: payment_create.payer,
                    upSells,
                    customer: {
                        name: data.name,
                        email: data.email,
                        cpf: data.cpf,
                        phone: data.phone,
                    },
                }
                try {
                    const expires = new Date(Date.now() + 30 * 60 * 1000).toUTCString()
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem('payment_info', JSON.stringify(toPersist))
                    }
                    document.cookie = `payment_info=${encodeURIComponent(JSON.stringify(toPersist))}; path=/; expires=${expires}; samesite=Lax`
                } catch {}
            } catch {}
            router.push("/checkout/pagamento")
        }
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form id="identificacao-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base text-muted-foreground">Nome completo</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="p-5 placeholder:text-base focus:text-base"
                                    placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base text-muted-foreground">E-mail</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    className="p-5 placeholder:text-base focus:text-base"
                                    placeholder="Seu e-mail" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base text-muted-foreground">CPF</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={formatCPF(field.value)}
                                    onChange={(e) => field.onChange(onlyDigits(e.target.value).slice(0, 11))}
                                    className="p-5 placeholder:text-base focus:text-base"
                                    placeholder="Digite seu CPF" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base text-muted-foreground">Celular</FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    inputMode="numeric"
                                    value={formatBrazilPhone(field.value)}
                                    onChange={(e) => field.onChange(onlyDigits(e.target.value).slice(0, 11))}
                                    className="p-5 placeholder:text-base focus:text-base"
                                    placeholder="Digite seu celular" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}