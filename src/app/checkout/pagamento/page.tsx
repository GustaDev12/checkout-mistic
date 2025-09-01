"use client"
import { SiteConfig } from "@/app/data/config"
import Image from "next/image"
import { useStoreUpSells } from "@/store/useCartStore"
import { CircleCheck, Copy, ShoppingBag } from "lucide-react"
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function PagamentoPage() {
  const { totalPrice, upSells } = useStoreUpSells()
  const [openDialog, setOpenDialog] = useState(false)
  const [openQrPreview, setOpenQrPreview] = useState(false)
  const TOTAL_SECONDS = 15 * 60
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [transactionInfo, setTransactionInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const transactionCookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('payment_info='))

    if (transactionCookie) {
      const info = JSON.parse(decodeURIComponent(transactionCookie.split('=')[1]))
      setTransactionInfo(info)
    } else {
      console.error("Cookie 'payment_info' não encontrado")
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading && !transactionInfo) {
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

  const selectedUpSells: IUpSell[] = (upSells && upSells.length > 0)
    ? upSells
    : (transactionInfo?.upSells ?? [])

  const displayTotal: number = (upSells && upSells.length > 0)
    ? totalPrice
    : (SiteConfig.price_pack + selectedUpSells.reduce((acc: number, cur: any) => acc + (cur?.preco || 0), 0))

  const itemsCount = 1 + selectedUpSells.length
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
      <main className="w-full max-w-[600px] md:max-w-[558px] relative flex flex-col mx-auto space-y-4 mt-6 mb-6 sm:mt-12 md:mt-20">
        {/* Bloco principal */}
        <Card className="bg-card border">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Aqui está o PIX copia e cola</CardTitle>
            <CardDescription>
              Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 items-start">
              {/* Código PIX + botão copiar */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={transactionInfo.copyPaste || ""}
                    readOnly
                    className="h-11 text-sm"
                    aria-label="Código PIX copia e cola"
                  />
                  <Button type="button" variant="outline" className="h-11" onClick={handleCopy} disabled={expired}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>

                <Button
                  onClick={confirmPayment}
                  disabled={expired}
                  className="w-full h-11 font-semibold bg-black text-white hover:bg-black/90"
                >
                  <CircleCheck className="w-4 h-4 mr-2" /> Confirmar pagamento
                </Button>

                {/* Contador regressivo + barra de progresso */}
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Faltam <span className="font-semibold tabular-nums">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span> minutos para o pagamento expirar...
                  </p>
                  <div className="mt-2 h-2 w-full rounded-sm border border-border overflow-hidden">
                    <div
                      className="h-full bg-foreground/80"
                      style={{ width: `${elapsedPercent}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <button
                type="button"
                onClick={() => setOpenQrPreview(true)}
                className="group border border-border rounded-sm p-3 w-full md:w-[220px] hover:bg-accent/30 transition-colors"
                aria-label="Ampliar QR Code"
              >
                <div className="relative mx-auto w-[180px] h-[180px]">
                  <Image
                    src={transactionInfo.qrcodeUrl}
                    alt="QR Code para pagamento PIX"
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">Clique para ampliar</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Instruções de pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-base font-medium">Para realizar o pagamento:</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm">1</span>
                <span>Abra o aplicativo do seu banco;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm">2</span>
                <span>Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm">3</span>
                <span>Confirme as informações e finalize o pagamento.</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Resumo da compra */}
        <Card>
          <CardHeader className="w-full flex-col flex">
            <div className="w-full flex items-center space-x-3">
              <div className="flex items-center space-x-2 w-full">
                <Button variant="outline" className="w-[36px] h-[36px] flex-shrink-0" size="sm">
                  <ShoppingBag className="!w-4 !h-4" />
                </Button>
                <h1 className="text-muted-foreground text-base font-medium">Sua Compra</h1>
              </div>
              <div className="text-end w-full font-normal justify-end flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-1">
                  <p className="text-muted-foreground">{itemsLabel}</p>
                  <span aria-hidden="true" className="mx-2">•</span>
                  <p className="text-foreground/80 text-base font-medium">{displayTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Image className='rounded-sm border max-w-[60px] h-[60px]' src={SiteConfig.imagem_pack} alt="Produto" width={60} height={60} quality={100} />
              <div>
                <p className="text-muted-foreground text-sm">Acesso Premium — {SiteConfig.modelo_name}</p>
                <p className="text-foreground text-base font-semibold">{displayTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>
            {selectedUpSells.length > 0 && (
              <div className="mt-4 space-y-3">
                {selectedUpSells.map((u: any, idx: number) => (
                  <div key={u?.id ?? idx} className="flex items-center gap-3">
                    <Image className='rounded-sm border max-w-[48px] h-[48px]' src={u?.imagem} alt={u?.titulo ?? 'Upsell'} width={48} height={48} quality={100} />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-sm">{u?.titulo}</p>
                    </div>
                    <p className="text-foreground text-sm font-medium">{Number(u?.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            {selectedUpSells.length > 0 && (
              <p className="text-xs text-muted-foreground">{selectedUpSells.length} oferta(s) adicionada(s) ao seu pedido.</p>
            )}
          </CardFooter>
        </Card>
      </main>
      <CheckoutFooter />

      {/* Modal de sucesso */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✨ Parabéns!</DialogTitle>
            <DialogDescription>
              Seu acesso exclusivo foi liberado. Confira seu e-mail, enviei todos os links pra você.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Preview do QR Code */}
      <Dialog open={openQrPreview} onOpenChange={setOpenQrPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code do PIX</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[340px]">
            <Image src={transactionInfo.qrcodeUrl} alt="QR Code ampliado" fill className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}