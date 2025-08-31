import db from '@/lib/db'

export const databaseRepository = {

    async updateTransaction(data: {
        transactionId: string,
        status: 'PENDENTE' | 'COMPLETO' | 'FALHOU',
    }) {
        return db.transaction.update({
            where: {
                external_id: data.transactionId,
            },
            data: {
                status: data.status,
            }
        })
    },

    async createTransaction(data: {
        transactionId: string,
        external_id: string,
        name: string,
        email: string,
        cpf: string,
        phone: string,
        amount: number,
        upSells?: unknown,
    }) {
        return db.transaction.create({
            data: {
                transactionId: data.transactionId,
                external_id: data.external_id,
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                phone: data.phone,
                amount: data.amount,
                upSells: data.upSells ? JSON.stringify(data.upSells) : JSON.stringify({})
            }
        })
    },

    async getTransactionState(external_id: string) {
        return db.transaction.findUnique({
            where: {
                external_id,
            }
        })
    }
}