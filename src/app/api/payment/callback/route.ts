import { databaseRepository } from "@/app/checkout/repository/database";
import { sendEmail } from "@/lib/resend";
import { NextResponse } from "next/server";

type Compra = {
    base: boolean;
    close_friends?: boolean;
    conteudos_proibidos?: boolean;
};

export function buildEmail(compra: Compra) {
    let html = `
  <html>
    <body style="margin:0; padding:0; background:#0d0d0d; color:#fff; font-family: 'Arial', sans-serif;">
      <div style="max-width:600px; margin:0 auto; background:#1a1a1a; border-radius:12px; overflow:hidden; box-shadow:0 0 25px rgba(233,30,99,0.4);">

        <!-- HEADER -->
        <div style="background:linear-gradient(135deg, #e91e63, #ff4081); padding:25px; text-align:center;">
          <h1 style="margin:0; font-size:28px; color:#fff;">🔥 Parabéns, amor!</h1>
          <p style="margin:5px 0 0; font-size:16px; color:#fff;">Seu prazer exclusivo foi liberado 😈</p>
        </div>

        <!-- BODY -->
        <div style="padding:25px;">
          <p style="font-size:16px; line-height:1.6;">
            Seu pagamento foi <span style="color:#4caf50; font-weight:bold;">aprovado com sucesso</span> e agora você tem acesso 
            ao conteúdo mais <span style="color:#e91e63; font-weight:bold;">quente e proibido</span> que já viu. 💋
          </p>
          <p style="font-size:16px;">Clique abaixo para acessar tudo o que escolheu:</p>
  `;

    // Sempre manda o pack base
    if (compra.base) {
        html += `
      <div style="margin:20px 0; padding:15px; background:#262626; border-radius:10px; text-align:center;">
        <h3 style="margin:0; font-size:18px; color:#fff;">✅ Pack Base</h3>
        <a href="https://drive.google.com/pack-base" 
           style="display:inline-block; margin-top:10px; padding:12px 20px; background:#e91e63; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; box-shadow:0 0 12px rgba(233,30,99,0.6);">
           Acessar Agora
        </a>
      </div>
    `;
    }

    if (compra.close_friends) {
        html += `
      <div style="margin:20px 0; padding:15px; background:#262626; border-radius:10px; text-align:center;">
        <h3 style="margin:0; font-size:18px; color:#fff;">Close Friends 30 Dias 🌟 | Premium</h3>
        <a href="#" 
           style="display:inline-block; margin-top:10px; padding:12px 20px; background:#ff9800; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; box-shadow:0 0 12px rgba(255,152,0,0.6);">
           Me chame no instagram com print desse e-mail
        </a>
      </div>
    `;
    }

    if (compra.conteudos_proibidos) {
        html += `
      <div style="margin:20px 0; padding:15px; background:#262626; border-radius:10px; text-align:center;">
        <h3 style="margin:0; font-size:18px; color:#fff;">Conteúdo Proibido 🔞 | Premium</h3>
        <a href="https://dropbox.com/conteudo-vip" 
           style="display:inline-block; margin-top:10px; padding:12px 20px; background:#4caf50; color:#fff; text-decoration:none; font-weight:bold; border-radius:8px; box-shadow:0 0 12px rgba(76,175,80,0.6);">
            Acessar conteúdos
        </a>
      </div>
    `;
    }

    html += `
          <!-- FOOTER -->
          <p style="margin-top:30px; font-size:14px; color:#bbb; text-align:center;">
            Se algum link não abrir, copie e cole no seu navegador.
          </p>
        </div>

        <div style="background:#0d0d0d; padding:15px; text-align:center; border-top:1px solid #333;">
          <p style="font-size:12px; color:#666; margin:0;">
            🔒 Sua compra é 100% segura.<br>
            Este e-mail foi enviado automaticamente, não responda.
          </p>
        </div>
      </div>
    </body>
  </html>
  `;

    return html;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { transactionId, status } = body;

        if (!transactionId) {
            return NextResponse.json(
                { message: "Transação não informado" },
                { status: 404 }
            )
        }

        if (!status) {
            return NextResponse.json(
                { message: "Status da transação não informado." },
                { status: 404 }
            )
        }

        const transaction = await databaseRepository.getTransactionState(transactionId);

        if (!transaction) {
            return NextResponse.json(
                { message: "Transação não encontrada" },
                { status: 404 }
            );
        }

        await databaseRepository.updateTransaction({
            transactionId,
            status: "COMPLETO",
        });

        if (status === "COMPLETO" && transaction.upSells) {
            const format: IUpSell[] = JSON.parse(transaction.upSells as string)
            // eslint-disable-next-line prefer-const
            let send_data: Compra = { base: true }
            format.forEach((item) => {
                if (item.id === "upsell-1") {
                    send_data.conteudos_proibidos = true
                } else if (item.id === "upsell-2") {
                    send_data.close_friends = true
                }
            })

            const email = buildEmail(send_data)
            const send = await sendEmail(transaction.email, "Acesso Exclusivo Liberado", email);

            if (send) {
                console.log("E-mail enviado com sucesso")
            } else {
                console.log("Erro ao enviar e-mail")
            }
        }

        return NextResponse.json(
            { message: "Transação atualizada com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Erro ao atualizar transação" },
            { status: 500 }
        );
    }
}