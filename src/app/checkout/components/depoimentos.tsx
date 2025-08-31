import { Depoimentos } from "../data/depoimentos";
import Image from "next/image";

export default function DepoimentosComponent() {
    return (
        <div className="flex flex-col space-y-5">
            {Depoimentos.map((item, index) => {
                return (
                    <div key={index}>
                        <header className="flex space-x-2">
                            <Image
                                src={item.avatar_ulr}
                                width={60}
                                height={60}
                                alt="Avatar Imagem"
                                className="rounded-full max-h-[60px]"
                            />
                            <div className="ml-1">
                                <h1 className="text-md text-base ">
                                    {item.name}
                                </h1>
                                <div className="flex items-center space-x-1 mt-1">
                                    {[0, 1, 2, 3, 4].map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.825 21L7.45 13.975L2 9.25L9.2 8.625L12 2L14.8 8.625L22 9.25L16.55 13.975L18.175 21L12 17.275L5.825 21Z" fill="#FFCD29" />
                                                </svg>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </header>
                        <p className="text-muted-foreground text-base mt-2">{item.depoiment}</p>
                    </div>
                )
            })}
        </div>
    )
}