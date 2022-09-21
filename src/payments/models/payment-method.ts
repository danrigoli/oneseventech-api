export interface PaymentMethod {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
}
