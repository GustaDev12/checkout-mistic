export const SiteConfig = {
    modelo_name: "Jade Maria",
    price_pack: 30,
    upsell: true,
    imagem_pack: "/pack/foto.png",
    upSells: [
        {
            id: "upsell-1",
            imagem: "/upsells/1.jpg",
            titulo: "Conteúdo Proibido 🔞 | Premium",
            preco: 49.99,
            vagas: 5,
            description: "Fotos e vídeos que não posto em lugar nenhum... só pra você 👀",
            new: true,
        },
        {
            id: "upsell-2",
            imagem: "/upsells/2.jpg",
            titulo: "Close Friends 30 Dias 🌟 | Premium",
            preco: 34.99,
            vagas: 12,
            description: "Acesso ao meu dia a dia + stories quentes e exclusivos 🔥",
            new: false,
        },
    ]
}