import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    cpf: z.string().min(11, { message: "CPF inválido" }),
    phone: z.string().min(11, { message: "Telefone inválido" }),
})

export const useFormSchema = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            cpf: "",
            phone: "",
        },
    })
    return { form, formSchema }
}