import { APIGatewayProxyResult } from 'aws-lambda';
import { PaymentError } from '../domain/Payment';
import { Logger } from './logger';

export const buildResponse = (statusCode: number, body: Object, logger?: Logger): APIGatewayProxyResult => {
    if (logger) {
        logger.debug('API response', { statusCode, body });
    }
    
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        },
    };
};

export const parseInput = <T>(body: string, logger?: Logger): T => {
    try {
        return JSON.parse(body) as T;
    } catch (err) {
        if (logger) {
            logger.error('Failed to parse input', { body, error: err });
        }
        throw new PaymentError('INVALID_INPUT', 'Invalid JSON input');
    }
};

export const handleError = (error: Error, logger?: Logger): APIGatewayProxyResult => {
    if (logger) {
        logger.error('API error', { error });
    }
    
    if (error instanceof PaymentError) {
        switch (error.code) {
            case 'NOT_FOUND':
                return buildResponse(404, { error: error.message });
            case 'VALIDATION_ERROR':
                return buildResponse(400, { error: error.message });
            case 'REPOSITORY_ERROR':
                return buildResponse(500, { error: 'Internal server error' });
            default:
                return buildResponse(500, { error: 'Internal server error' });
        }
    }
    
    return buildResponse(500, { error: 'Internal server error' });
};

