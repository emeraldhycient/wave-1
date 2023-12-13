import axiosClient from "../../helpers/apiClient";

type TCardDetails = {
    cardHolder: string, cardNumber: string | number, exp: string, cvv: number, plan
    ?: string, currency?: string
}

class PaymentService {
    makeCardPayment({ cardHolder, cardNumber, exp, cvv, plan = "BASIC", currency = "SAR" }: TCardDetails) {
        const expD = exp.split("/")

        console.log({
            plan,
            currency,
            source: {
                number: cardNumber,
                name: cardHolder,
                cvc: cvv,
                month: expD[0],
                year: expD[1],
                type: "creditcard",
            }
        })

        return axiosClient.post("payments/?source_type=creditcard", {
            plan,
            currency,
            source: {
                number: cardNumber,
                name: cardHolder,
                cvc: cvv,
                month: expD[0],
                year: expD[1],
                type: "creditcard",
            }

        })
    }
}

export const paymentService = new PaymentService()