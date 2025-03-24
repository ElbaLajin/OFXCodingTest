import { DocumentClient } from '../lib/dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Payment, PaymentError } from '../domain/Payment';
import { Logger } from '../lib/logger';

export interface IPaymentRepository {
    getById(paymentId: string): Promise<Payment | null>;
    getPaymentsByCurrency(currency: string): Promise<Payment[]>;
    getAllPayments(): Promise<Payment[]>;
    create(payment: Payment): Promise<void>;
}

export class PaymentRepository implements IPaymentRepository {
    private readonly tableName: string;
    private readonly logger: Logger;

    constructor(tableName: string = 'Payments', logger: Logger) {
        this.tableName = tableName;
        this.logger = logger;
    }

    async getById(paymentId: string): Promise<Payment | null> {
        try {
            const result = await DocumentClient.send(
                new GetCommand({
                    TableName: this.tableName,
                    Key: { id: paymentId },
                })
            );

            return (result.Item as Payment) || null;
        } catch (error) {
            this.logger.error('Failed to get payment', { paymentId, error });
            throw new PaymentError('REPOSITORY_ERROR', 'Failed to retrieve payment');
        }
    }

    async getAllPayments(): Promise<Payment[]> {
        try {
            const result = await DocumentClient.send(
                new ScanCommand({
                    TableName: this.tableName,
                })
            );

            return (result.Items as Payment[]) || [];
        } catch (error) {
            this.logger.error('Failed to list payments', { error });
            throw new PaymentError('REPOSITORY_ERROR', 'Failed to retrieve payments');
        }
    }

    async getPaymentsByCurrency(currency: string): Promise<Payment[]> {
        try {
            const result = await DocumentClient.send(
                new ScanCommand({
                    TableName: this.tableName,
                    FilterExpression: '#currency = :currency',
                    ExpressionAttributeNames: {
                        '#currency': 'currency',
                    },
                    ExpressionAttributeValues: {
                        ':currency': currency,
                    },
                })
            );
    
            return (result.Items as Payment[]) || [];
        } catch (error) {
            this.logger.error('Failed to list payments by currency', { error, currency });
            throw new PaymentError('REPOSITORY_ERROR', `Failed to retrieve payments for currency ${currency}`);
        }
    }    

    async create(payment: Payment): Promise<void> {
        try {
            await DocumentClient.send(
                new PutCommand({
                    TableName: this.tableName,
                    Item: payment,
                })
            );
        } catch (error) {
            this.logger.error('Failed to create payment', { payment, error });
            throw new PaymentError('REPOSITORY_ERROR', 'Failed to create payment');
        }
    }
}
