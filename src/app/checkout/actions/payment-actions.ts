"use server"

import { v4 } from 'uuid'
import { databaseRepository } from '../repository/database'
import { SiteConfig } from '@/app/data/config';

export const createPayment = async ( data: { name: string, email: string, cpf: string, phone: string, upSells?: {
    id: string,
}[] }) => {
    try {
        const transactionId = v4();
        let totalAmount = SiteConfig.price_pack;
        
        const upSells = data.upSells?.map((item) => ({
            id: item.id,
            preco: SiteConfig.upSells.find((upSell) => upSell.id === item.id)?.preco || 0,
        }))
        
        if (upSells) {
            totalAmount = totalAmount + upSells.reduce((acc, cur) => acc + cur.preco, 0)
        }
        const response = await fetch("https://api.misticpay.com/api/transactions/create", {
            method: "POST",
            headers: {
                "ci": process.env.MISTIC_CLIENT_ID || "",
                "cs": process.env.MISTIC_CLIENT_SECRET || "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "amount": totalAmount,
                "payerName": data.name,
                "payerDocument": data.cpf,
                "transactionId": transactionId,
                "description": "Compra no site do Hot",
            })
        })
        const json = await response.json()
        const response_data: {
            transactionId: string,
            payer: {
                name: string,
                document: string
            },
            transactionFee: number,
            transactionType: string,
            transactionMethod: string,
            transactionAmount: number,
            transactionState: string,
            qrcodeUrl: string,
            copyPaste: string
        } = json.data
        await databaseRepository.createTransaction({
            transactionId: transactionId.toString(),
            external_id: response_data.transactionId,
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            phone: data.phone,
            amount: totalAmount,
            upSells: data.upSells,
        })
        return { ...response_data, internalTransactionId: transactionId };
    } catch (error) {
        console.log(error)
        return null
    }
}

export const checkPayment = async (external_id: string) => {
    try {
        if (!external_id) return {
            message: "Transação não encontrada!",
            status: "NÃO_ENCONTRADA",
        }
        const transaction = await databaseRepository.getTransactionState(external_id)
        if (!transaction) {
            return {
                message: "Transação não encontrada!",
                status: "NÃO_ENCONTRADA",
            }
        }
        return {
            message: transaction.status,
            status: "ENCONTRADA",
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Erro ao verificar transação",
            status: "ERRO",
        }
    }
}