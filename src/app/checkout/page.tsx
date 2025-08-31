"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Depoimentos } from "@/app/checkout/data/depoimentos";
import { CreditCard, CircleDollarSign, Info, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import FormIndetificacao from "./form/form-identificacao"
import DepoimentosComponent from "./components/depoimentos"
import BuyComponent from "./components/buy-component";
import { useStoreUpSells } from "@/store/useCartStore";
import CheckoutFooter from "./components/checkout-footer";

export default function CheckoutPage() {
    const { totalPrice } = useStoreUpSells();

    return (
        <div className="w-full mt-2 min-h-screen px-3 sm:px-6 lg:px-8">
            <main className="w-full max-w-[558px] mx-auto space-y-4">
                <Image
                    src="/banners/jade_maria/banner.png"
                    width={558}
                    height={256}
                    alt="Imagem Banner"
                    quality={100}
                    className="w-full h-auto max-h-[256px] object-cover"
                />
                <div className="w-full max-w-[540px] flex flex-col space-y-3">
                    <Card className="bg-transparent">
                        <CardHeader className="flex flex-row items-center space-x-1 space-y-0">
                            <Button
                                variant={"outline"}
                                className="w-[40px] h-[40px] flex-shrink-0" size="sm">
                                <User className="!w-6 !h-6" />
                            </Button>
                            <CardTitle className="text-base text-foreground">
                                Identificação
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormIndetificacao />
                        </CardContent>
                    </Card>
                    <Card className="bg-transparent">
                        <CardHeader className="flex flex-row justify-between items-center space-x-2 space-y-0">
                            <CardTitle className="text-md text-foreground">
                                Depoimentos
                            </CardTitle>
                            <CardTitle className="font-medium text-muted-foreground text-sm sm:text-base">
                                {Depoimentos.length} Depoimentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DepoimentosComponent />
                        </CardContent>
                    </Card>
                    <Card className="bg-transparent">
                        <CardHeader className="w-full flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={"outline"}
                                    className="w-[36px] h-[36px] flex-shrink-0" size="sm">
                                    <CreditCard className="!w-4 !h-4" />
                                </Button>
                                <CardTitle className="text-base text-foreground">
                                    Pagamento
                                </CardTitle>
                            </div>
                            <CardTitle className="text-base font-light text-foreground">
                                Pix
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-border p-4 rounded-sm w-20 bg-primary/5 flex-shrink-0">
                                <svg width="40" height="14" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                    <g clipPath="url(#clip0_617_511)">
                                        <g clipPath="url(#clip1_617_511)">
                                            <path d="M28.735 1.85938C28.6024 1.85938 28.4752 1.91205 28.3814 2.00582C28.2876 2.09959 28.235 2.22677 28.235 2.35938C28.235 2.49198 28.2876 2.61916 28.3814 2.71293C28.4752 2.8067 28.6024 2.85938 28.735 2.85938H29.741C30.126 2.85938 30.494 3.01638 30.764 3.29138H30.766L33.121 5.67637C33.258 5.81437 33.377 5.88538 33.377 5.88538C33.377 5.88538 33.258 5.95538 33.121 6.09438L30.766 8.47837C30.496 8.75337 30.126 8.90837 29.741 8.90837H28.735C28.6024 8.90837 28.4752 8.96105 28.3814 9.05482C28.2876 9.14859 28.235 9.27577 28.235 9.40837C28.235 9.54098 28.2876 9.66816 28.3814 9.76193C28.4752 9.8557 28.6024 9.90837 28.735 9.90837H29.741C30.393 9.90837 31.019 9.64637 31.477 9.18237L31.479 9.18038L33.832 6.79537H33.834C33.8589 6.76838 33.8891 6.74683 33.9228 6.7321C33.9564 6.71736 33.9927 6.70975 34.0295 6.70975C34.0662 6.70975 34.1025 6.71736 34.1362 6.7321C34.1698 6.74683 34.2001 6.76838 34.225 6.79537H34.227L36.573 9.17237C36.7997 9.40259 37.07 9.58548 37.368 9.71045C37.666 9.83542 37.9858 9.89998 38.309 9.90038H39.127C39.2596 9.90038 39.3868 9.8477 39.4805 9.75393C39.5743 9.66016 39.627 9.53298 39.627 9.40038C39.627 9.26777 39.5743 9.14059 39.4805 9.04682C39.3868 8.95305 39.2596 8.90038 39.127 8.90038H38.309C37.927 8.90038 37.557 8.74537 37.284 8.46937L34.938 6.09438C34.8597 6.01297 34.7709 5.94235 34.674 5.88438C34.676 5.88538 34.801 5.81437 34.938 5.67637L37.284 3.29838C37.554 3.02338 37.924 2.86837 38.309 2.86837H39.127C39.2596 2.86837 39.3868 2.8157 39.4805 2.72193C39.5743 2.62816 39.627 2.50098 39.627 2.36837C39.627 2.23577 39.5743 2.10859 39.4805 2.01482C39.3868 1.92105 39.2596 1.86838 39.127 1.86838H38.307C37.654 1.86838 37.03 2.13238 36.573 2.59738L34.227 4.97437C34.202 5.00202 34.1716 5.02412 34.1375 5.03925C34.1035 5.05437 34.0667 5.06219 34.0295 5.06219C33.9922 5.06219 33.9554 5.05437 33.9214 5.03925C33.8874 5.02412 33.8569 5.00202 33.832 4.97437L31.48 2.59038C31.253 2.35974 30.9825 2.17645 30.6841 2.05114C30.3858 1.92583 30.0656 1.86099 29.742 1.86038L28.735 1.85938ZM24.685 1.86538C24.5524 1.86538 24.4252 1.91805 24.3314 2.01182C24.2376 2.10559 24.185 2.23277 24.185 2.36538C24.185 2.49798 24.2376 2.62516 24.3314 2.71893C24.4252 2.8127 24.5524 2.86538 24.685 2.86538H25.7C25.7778 2.86509 25.8549 2.88039 25.9267 2.91038C25.9986 2.94037 26.0637 2.98444 26.1182 3.03999C26.1727 3.09553 26.2155 3.16144 26.2442 3.23381C26.2728 3.30618 26.2867 3.38356 26.285 3.46138V3.46337V9.46138C26.285 9.59398 26.3376 9.72116 26.4314 9.81493C26.5252 9.9087 26.6524 9.96138 26.785 9.96138C26.9176 9.96138 27.0448 9.9087 27.1385 9.81493C27.2323 9.72116 27.285 9.59398 27.285 9.46138V3.46738C27.286 3.04597 27.1206 2.64119 26.8247 2.34116C26.5288 2.04112 26.1264 1.87012 25.705 1.86538H25.702H24.685ZM19.061 1.86738C17.329 1.86738 15.918 3.29838 15.918 5.04338V13.0704C15.918 13.203 15.9706 13.3302 16.0644 13.4239C16.1582 13.5177 16.2854 13.5704 16.418 13.5704C16.5506 13.5704 16.6778 13.5177 16.7715 13.4239C16.8653 13.3302 16.918 13.203 16.918 13.0704V5.04338C16.918 3.83337 17.875 2.86838 19.058 2.86738L21.398 2.87137C22.581 2.87337 23.534 3.83438 23.534 5.04138V6.75137C23.534 7.96137 22.577 8.92638 21.393 8.92638H18.083C17.9504 8.92638 17.8232 8.97905 17.7294 9.07282C17.6356 9.16659 17.583 9.29377 17.583 9.42638C17.583 9.55898 17.6356 9.68616 17.7294 9.77993C17.8232 9.8737 17.9504 9.92638 18.083 9.92638H21.393C23.125 9.92638 24.533 8.49538 24.533 6.75238V5.04138C24.533 3.30138 23.129 1.87338 21.401 1.86938L19.061 1.86738Z" fill="#939598" />
                                            <path d="M26.7752 0C26.7366 0.000125212 26.6984 0.00796427 26.6628 0.0230571C26.6273 0.0381498 26.5951 0.0601923 26.5682 0.0878906L26.1072 0.552734C26.052 0.608684 26.0211 0.68411 26.0211 0.762695C26.0211 0.84128 26.052 0.916706 26.1072 0.972656L26.5682 1.4375C26.5952 1.46502 26.6274 1.48689 26.6629 1.50181C26.6985 1.51674 26.7366 1.52443 26.7752 1.52443C26.8137 1.52443 26.8519 1.51674 26.8875 1.50181C26.923 1.48689 26.9552 1.46502 26.9822 1.4375L27.4412 0.972656C27.4964 0.916706 27.5273 0.84128 27.5273 0.762695C27.5273 0.68411 27.4964 0.608684 27.4412 0.552734L26.9822 0.0878906C26.9553 0.0601924 26.9231 0.03815 26.8876 0.0230573C26.852 0.00796446 26.8138 0.000125345 26.7752 0ZM6.50566 0.978516C6.09625 1.04348 5.71842 1.23787 5.42753 1.5332L2.98027 4.01367H3.36112C3.86612 4.01367 4.34102 4.21322 4.69902 4.57422L6.64042 6.53711C6.78042 6.67911 7.00628 6.67911 7.14628 6.53711L9.07987 4.58008C9.2544 4.40251 9.46266 4.26162 9.69242 4.16569C9.92217 4.06976 10.1688 4.02073 10.4178 4.02148H10.6502L8.19511 1.5332C7.97812 1.31275 7.71157 1.14739 7.41768 1.0509C7.12379 0.954406 6.81109 0.929589 6.50566 0.978516ZM2.43339 4.56836L0.945109 6.07617C0.577245 6.45024 0.371094 6.95387 0.371094 7.47852C0.371094 8.00316 0.577245 8.50679 0.945109 8.88086L2.43534 10.3867C2.46707 10.3742 2.50083 10.3676 2.53495 10.3672H3.36308C3.71308 10.3672 4.05263 10.2246 4.29862 9.97461L6.23612 8.00977C6.41168 7.83858 6.64717 7.74277 6.89237 7.74277C7.13758 7.74277 7.37307 7.83858 7.54862 8.00977L9.48027 9.9668C9.72627 10.2168 10.0688 10.3594 10.4178 10.3594H11.0916C11.1271 10.3599 11.1623 10.3672 11.1951 10.3809L12.6795 8.88086C13.0473 8.50679 13.2535 8.00316 13.2535 7.47852C13.2535 6.95387 13.0473 6.45024 12.6795 6.07617L11.1951 4.57422C11.1623 4.58789 11.1271 4.59518 11.0916 4.5957H10.4178C10.0678 4.5957 9.72627 4.73928 9.48027 4.98828L7.54862 6.94531C7.46303 7.03217 7.36102 7.10114 7.24852 7.14822C7.13603 7.1953 7.0153 7.21954 6.89335 7.21954C6.7714 7.21954 6.65067 7.1953 6.53818 7.14822C6.42569 7.10114 6.32368 7.03217 6.23808 6.94531L4.29862 4.98047C4.17592 4.85651 4.02993 4.75801 3.86905 4.69064C3.70816 4.62327 3.53555 4.58835 3.36112 4.58789H2.533C2.49888 4.58755 2.46511 4.58093 2.43339 4.56836ZM6.89237 8.31445C6.79748 8.31454 6.70638 8.35169 6.63847 8.41797L4.69902 10.3809C4.52472 10.5582 4.31678 10.6989 4.08737 10.7949C3.85797 10.8908 3.61173 10.9399 3.36308 10.9395H2.98222L5.42948 13.4199C5.61005 13.6037 5.82541 13.7497 6.063 13.8493C6.30059 13.9489 6.55564 14.0002 6.81327 14.0002C7.07091 14.0002 7.32596 13.9489 7.56355 13.8493C7.80113 13.7497 8.0165 13.6037 8.19706 13.4199L10.6502 10.9336H10.4178V10.9355C9.91277 10.9355 9.43592 10.735 9.07792 10.375L7.14628 8.41797C7.07837 8.35169 6.98727 8.31454 6.89237 8.31445Z" fill="#32BCAD" />
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_617_511">
                                            <rect width="40" height="14" fill="white" />
                                        </clipPath>
                                        <clipPath id="clip1_617_511">
                                            <rect width="40" height="14" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="mt-5">
                                <header className="flex items-start space-x-2">
                                    <Info className="!w-4 !h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-foreground text-sm leading-relaxed">Informações sobre o pagamento via PIX</p>
                                </header>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    O pagamento é instantâneo e liberação imediata.<br />
                                    Ao clicar em <span className="text-foreground">“Comprar agora”</span> você será encaminhado para um ambiente seguro, onde encontrará o passo a passo para realizar o pagamento.
                                </p>
                                <div className="flex justify-center font-medium mt-7 space-x-2 text-muted-foreground items-center text-center w-full">
                                    <CircleDollarSign />
                                    <p> Valor à vista: <span className="text-foreground text-md">{totalPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <BuyComponent />
                </div>
            </main>
            <CheckoutFooter />
        </div>
    )
}