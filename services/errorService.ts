
import { AiProvider } from './apiKeyManager';

// A simplified interface to help with type checking for potential API errors
interface ApiError extends Error {
    code?: string;
}

export const isDailyLimitError = (error: Error, provider: AiProvider): boolean => {
    if (!error || !error.message) return false;

    if (provider === 'openai') {
        // OpenAI doesn't have a "daily free limit" in the same way Gemini does.
        // "insufficient_quota" is a billing issue, not a daily limit that resets.
        return false;
    }

    // Gemini check
    const msg = error.message.toLowerCase();
    return msg.includes('daily limit') || msg.includes('quota has been exhausted for this project');
};

export const isRateLimitError = (error: Error, provider: AiProvider): boolean => {
    if (!error) return false;

    // A daily limit is a type of rate limit, but we want to handle it differently.
    if (isDailyLimitError(error, provider)) {
        return false;
    }

    if (provider === 'openai') {
        const apiError = error as ApiError;
        // This specifically targets per-minute rate limits for OpenAI.
        // The `insufficient_quota` error code is a different 429 error related to billing.
        return apiError.code === 'rate_limit_exceeded';
    }

    // Gemini check for per-minute rate limits
    if (!error.message) return false;
    try {
        const errorDetails = JSON.parse(error.message);
        const status = errorDetails?.error?.status;
        return status === 'RESOURCE_EXHAUSTED';
    } catch (e) {
        const msg = error.message.toLowerCase();
        // Avoid catching "daily limit" or broad "quota" messages here.
        return msg.includes('resource_exhausted') || (msg.includes('rate limit') && !msg.includes('daily limit'));
    }
};

export const getFriendlyErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error) || !error.message) {
        return "An unknown error occurred. Please try again.";
    }

    const apiError = error as ApiError;
    if (apiError.code === 'insufficient_quota') {
        return "Your OpenAI account has insufficient quota. Please check your plan and billing details.";
    }
     if (apiError.code === 'invalid_api_key') {
        return "The provided OpenAI API key is invalid or has been revoked.";
    }

    try {
        // The Gemini SDK often stringifies the API error response in the message
        const errorDetails = JSON.parse(error.message);
        const message = errorDetails?.error?.message;

        if (message && typeof message === 'string') {
            return message.replace(/\[.*?\]\s/g, ''); // Removes prefixes like [400]
        }
    } catch (e) {
        // Not a JSON message, return the original message if it's not too technical
        if (error.message.length < 200 && !error.message.startsWith('429')) {
           return error.message;
        }
    }

    return "An unexpected error occurred. Please check your API key and account status with your provider.";
};
