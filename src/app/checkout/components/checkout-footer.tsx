import Image from "next/image";

export default function CheckoutFooter() {
  return (
    <footer className="w-full mt-6 mb-6 border-t border-border">
      <div className="mx-auto max-w-[550px] pt-6">
        {/* Selos de segurança */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-4">
          <div className="flex justify-center items-center">
            <Image
              src={"/icons/ssl.png"}
              width={180}
              height={180}
              className=""
              alt="SSL Icone"
            />
          </div>
          <div className="flex justify-center items-center">
            <Image
              src={"/icons/compra-segura.png"}
              width={150}
              height={150}
              alt="Compra Segura"
            />
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/icons/pix.svg"
              alt="Pix"
              width={120}
              height={120}
              className="max-w-[150px] max-h-[150px]"
            />
          </div>
        </div>

        {/* Mensagens de reforço de segurança */}
        <div className="mt-4 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Sua compra é protegida por criptografia SSL
          </p>
          <p className="text-xs text-muted-foreground">
            Pagamento processado com segurança e liberação imediata
          </p>
        </div>
      </div>
    </footer>
  );
}