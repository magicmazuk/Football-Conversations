export const isRateLimitError = (error: Error): boolean => {
    if (!error || !error.message) return false;

    try {
        const errorDetails = JSON.parse(error.message);
        const status = errorDetails?.error?.status;
        return status === 'RESOURCE_EXHAUSTED';
    } catch (e) {
        // Fallback for non-JSON messages
        const msg = error.message.toLowerCase();
        return msg.includes('resource_exhausted') || msg.includes('quota') || msg.includes('rate limit');
    }
};

export const getFriendlyErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error) || !error.message) {
        return "An unknown error occurred. Please try again.";
    }

    try {
        // The Gemini SDK often stringifies the API error response in the message
        const errorDetails = JSON.parse(error.message);
        const status = errorDetails?.error?.status;
        const message = errorDetails?.error?.message;

        if (status === 'RESOURCE_EXHAUSTED') {
            return "API quota exceeded. Please check your billing details and try again later.";
        }

        // Return the Gemini API's message if it exists and is helpful
        if (message && typeof message === 'string') {
            // Clean up the message a bit if needed
            return message.replace(/\[.*?\]\s/g, ''); // Removes prefixes like [400]
        }
    } catch (e) {
        // Not a JSON message, return the original message if it's not too technical
        if (error.message.length < 200) { // arbitrary length to avoid huge stack traces
           return error.message;
        }
    }

    // Fallback for very technical or long messages
    return "An unexpected error occurred while contacting the AI service.";
};