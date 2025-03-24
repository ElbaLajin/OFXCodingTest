import { v4 as uuidv4 } from 'uuid';
import { Payment, PaymentStatus, PaymentError } from '../domain/Payment';
import { IPaymentRepository } from '../repositories/PaymentRepository';
import { Logger } from '../lib/logger';

export interface PaymentCreateDTO {
    amount: number;
    currency: string;
}

export interface IPaymentService {
    getPayment(paymentId: string): Promise<Payment>;
    listPayments(currency: string | undefined): Promise<Payment[]>;
    createPayment(paymentData: PaymentCreateDTO): Promise<Payment>;
}

export class PaymentService implements IPaymentService {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly logger: Logger
    ) {}

    async getPayment(paymentId: string): Promise<Payment> {
        this.logger.info('Getting payment', { paymentId });
        
        if (!paymentId) {
            throw new PaymentError('VALIDATION_ERROR', 'Payment ID is required');
        }

        const payment = await this.paymentRepository.getById(paymentId);

        if (!payment) {
            throw new PaymentError('NOT_FOUND', `Payment with ID ${paymentId} not found`);
        }

        return payment;
    }

    async listPayments(currency?: string): Promise<Payment[]> {
        return currency
        ? this.paymentRepository.getPaymentsByCurrency(currency)
        : this.paymentRepository.getAllPayments();
    }

    async createPayment(paymentData: PaymentCreateDTO): Promise<Payment> {
        this.logger.info('Creating payment', { paymentData });
        
        this.validatePaymentData(paymentData);
        
        const now = new Date().toISOString();
        const payment: Payment = {
            id: uuidv4(),
            amount: paymentData.amount,
            currency: paymentData.currency,
            status: PaymentStatus.PENDING,
            createdAt: now,
            updatedAt: now
        };

        await this.paymentRepository.create(payment);
        return payment;
    }

    private validatePaymentData(paymentData: PaymentCreateDTO): void {
        if (!paymentData.amount || paymentData.amount <= 0) {
            throw new PaymentError('VALIDATION_ERROR', 'Amount must be a positive number');
        }

        if (!paymentData.currency || paymentData.currency.trim().length !== 3) {
            throw new PaymentError('VALIDATION_ERROR', 'Currency must be a valid 3-letter code');
        }
    }
}
