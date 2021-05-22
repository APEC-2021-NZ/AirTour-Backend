import { ApolloError } from 'apollo-server-errors'

class ReviewError extends ApolloError {
    constructor(message = 'Review error', code = 'REVIEW_ERROR') {
        super(message, code)
    }
}

class NoBookingReviewError extends ReviewError {
    constructor() {
        super(
            'You cannot review a guide before you have completed a booking with them.',
            'NO_BOOKING_REVIEW_ERROR',
        )
    }
}

class DoubleReviewError extends ReviewError {
    constructor() {
        super(
            'You cannot review a guide more than once.',
            'DOUBLE_REVIEW_ERROR',
        )
    }
}

export { NoBookingReviewError, DoubleReviewError }
export default ReviewError
