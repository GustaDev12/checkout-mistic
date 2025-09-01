"use client"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteConfig } from "@/app/data/config"
import { ShoppingBag, Clock, Check } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useStoreUpSells } from "@/store/useCartStore"

export default function BuyComponent() {
    const item = 1;
    const { upSells, totalPrice, addUpSell, removeUpSell } = useStoreUpSells();

    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 30,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: 2, minutes: 30, seconds: 0 }; 
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const isUpSellSelected = (upsellId: string) => {
        return upSells.some(upsell => upsell.id === upsellId);
    };

    const handleUpSellChange = (upsell: IUpSell, checked: boolean) => {
        if (checked) {
            addUpSell(upsell);
        } else {
            removeUpSell(upsell);
        }
    };


    const handleBuyClick = () => {
        const formEl = document.getElementById("identificacao-form") as HTMLFormElement | null;
        if (!formEl) return;
        if (typeof (formEl as any).requestSubmit === "function") {
            (formEl as any).requestSubmit();
        } else {
            const event = new Event("submit", { cancelable: true, bubbles: true });
            formEl.dispatchEvent(event);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const onSubmitting = (e: Event) => {
            const custom = e as CustomEvent<boolean>
            setIsSubmitting(!!custom.detail)
        }
        window.addEventListener('checkout:submitting', onSubmitting as EventListener)
        return () => window.removeEventListener('checkout:submitting', onSubmitting as EventListener)
    }, [])

    return (
        <Card className="bg-transparent">
            <CardHeader className="w-full flex-col flex">
                <div className="w-full flex items-center space-x-3">
                    <div className="flex items-center space-x-2 w-full">
                        <Button
                            variant={"outline"}
                            className="w-[36px] h-[36px] flex-shrink-0" size="sm">
                            <ShoppingBag className="!w-4 !h-4" />
                        </Button>
                        <h1 className="text-muted-foreground text-base font-medium">Sua Compra</h1>
                    </div>
                    <div className="text-end w-full font-normal justify-end flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                            <p className="text-muted-foreground">{item + upSells.length} {item + upSells.length === 1 ? 'item' : 'itens'}</p>
                            <span aria-hidden="true" className="mx-2">•</span>
                            <p className="text-foreground/80 text-base font-medium">{totalPrice.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</p>
                        </div>
                    </div>
                </div>
                {SiteConfig.upsell && (
                    <div className="w-full rounded-sm ">
                        <header>
                            <p className="text-white font-medium text-lg">Oferta Limitada</p>
                        </header>
                        <main className="space-y-2 ">
                            {SiteConfig.upSells.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className=" flex-col rounded-sm flex border border-border p-3">
                                        <header
                                            className="bg-[#F5EBD7] p-2 rounded-sm flex items-center space-x-1 mb-3">
                                            <label htmlFor={`upsell-${index}`} className="flex items-center space-x-2 w-full cursor-pointer">
                                                <div className="relative inline-flex items-center justify-center w-6 h-6 shrink-0">
                                                    <Checkbox
                                                        className="h-5 w-5 rounded-[4px] !bg-white border border-orange-400 data-[state=checked]:!bg-yellow-400 data-[state=checked]:!border-orange-400"
                                                        id={`upsell-${index}`}
                                                        checked={isUpSellSelected(item.id)}
                                                        onCheckedChange={(checked) => handleUpSellChange(item, checked === true)}
                                                    />
                                                    {isUpSellSelected(item.id) && (
                                                        <Check className="w-3 h-3 absolute inset-0 m-auto text-black pointer-events-none" />
                                                    )}
                                                </div>

                                                <span className="text-black dark:text-muted text-sm select-none">Adicionar Oferta</span>
                                            </label>
                                        </header>
                                        <div>
                                            <div className="flex space-x-2">
                                                <Image className='rounded-sm border-1 border-zinc-400 max-w-[60px] h-[60px]' src={item.imagem} alt={item.titulo} width={60} height={60} quality={100} />
                                                <div >
                                                    <p className="text-muted-foreground text-md font-medium">{item.titulo}</p>
                                                    <p className="text-muted-foreground text-sm mb-1">{item.description}</p>
                                                    <div className="flex flex-col items-end">
                                                        <p className="text-foreground text-lg font-semibold">{item.preco.toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}</p>
                                                        <p className="text-red-400 text-xs font-medium animate-pulse">⚡ Apenas {item.vagas} vagas disponíveis este mês</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </main>
                    </div>
                )}
            </CardHeader>
            <CardFooter className="flex flex-col space-y-3">
                {/* Contador Regressivo */}
                <div className="w-full bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">Oferta disponível até</span>
                        <span className="text-white font-bold text-sm">
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-red-400">⏰</span>
                    </div>
                </div>

                {/* Botão de Compra Melhorado */}
                <Button
                    className="text-white bg-gradient-to-r from-green-600 to-green-700 w-full h-14 text-lg font-bold hover:from-green-700 hover:to-green-800 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleBuyClick} aria-label="Confirmar e ir para pagamento PIX"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Gerando pagamento…' : '🔥 Liberar meu acesso imediato'}
                </Button>
            </CardFooter>
        </Card>
    )
}