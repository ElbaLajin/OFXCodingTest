export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export class PaymentError extends Error {
    constructor(public readonly code: string, message: string) {
        super(message);
        this.name = 'PaymentError';
    }
}
