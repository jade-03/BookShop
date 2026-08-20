export enum PayementMethod {
    Card = 'card',
    PayPal = 'paypal',
    ApplePay = 'apple_pay',
}

export const OptionCondition = [
    { value: PayementMethod.Card, label: 'Carte bancaire' },
    { value: PayementMethod.PayPal, label: 'Paypal' },
  { value: PayementMethod.ApplePay, label: 'Apple Pay' },
]
