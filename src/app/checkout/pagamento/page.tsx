"use client"
import { SiteConfig } from "@/app/data/config"
import Image from "next/image"
import { useStoreUpSells } from "@/store/useCartStore"
import { PaperclipIcon, CircleCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import CheckoutFooter from "../components/checkout-footer"
import { toast } from "sonner"
import { checkPayment } from "../actions/payment-actions"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PagamentoPage() {
  const { totalPrice, upSells } = useStoreUpSells()
  const [openDialog, setOpenDialog] = useState(false)
  const TOTAL_SECONDS = 15 * 60
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [transactionInfo, setTransactionInfo] = useState<any>(null) // <-- Estado para armazenar os dados do cookie
  const [loading, setLoading] = useState(true) // <-- Evita renderizar antes de ter os dados

  useEffect(() => {
    // Este código só roda no cliente
    const transactionCookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('payment_info='))

    if (transactionCookie) {
      const info = JSON.parse(decodeURIComponent(transactionCookie.split('=')[1]))
      setTransactionInfo(info)
    } else {
      console.error("Cookie 'payment_info' não encontrado")
    }

    setLoading(false) // Finaliza o carregamento
  }, [])

  useEffect(() => {
    if (!loading && !transactionInfo) {
      // Pode mostrar um erro ou redirecionar
      console.error("Nenhum dado de pagamento encontrado")
    }
  }, [loading, transactionInfo])

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const elapsedPercent = ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100
  const expired = remaining <= 0

  const itemsCount = 1 + upSells.length
  const itemsLabel = itemsCount === 1 ? "1 item" : `${itemsCount} itens`

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!transactionInfo) {
    return (
      <h1 className="text-3xl text-red-500 text-center mx-auto">
        Oops! Algo deu errado. Dados de pagamento não encontrados.
      </h1>
    )
  }

  const confirmPayment = async () => {
    const data = await checkPayment(transactionInfo.providerTransactionId)
    if (data.status === "ENCONTRADA") {
      if (data.message === "PENDENTE") {
        toast.info("Pagamento pendente, aguarde")
      } else if (data.message === "COMPLETO") {
        toast.success("Pagamento realizado com sucesso")
        setOpenDialog(true)
      }
    } else if (data.status === "NÃO_ENCONTRADA") {
      toast.error(data.message)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionInfo.copyPaste)
    toast.success("Copiado para a área de transferência")
  }

  return (
    <div className="w-full min-h-screen px-3 sm:px-6 lg:px-8">
      <main className="w-full max-w-[600px] md:max-w-[558px] relative flex flex-col mx-auto space-y-4 mt-6 mb-6 sm:mt-12 md:mt-20 border border-border rounded-sm p-4 bg-card">
        {/* ... restante do JSX (igual ao seu código) ... */}
      </main>
      <CheckoutFooter />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✨ Parabéns, amor!</DialogTitle>
            <DialogDescription>
              Seu acesso exclusivo foi liberado 🔥
              Confira seu e-mail, enviei todos os links só pra você.
              Se prepare, essa vai ser a experiência mais quente da sua vida 😈
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}