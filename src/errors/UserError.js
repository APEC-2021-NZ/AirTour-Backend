import { ApolloError } from 'apollo-server-errors'

class UserError extends ApolloError {
    constructor(message = 'User error', code = 'USER_ERROR') {
        super(message, code)
    }
}

class EmailTakenError extends UserError {
    constructor() {
        super(
            'That email address has already been registered with another account.',
            'EMAIL_TAKEN_ERROR',
        )
    }
}

class InvalidEmailError extends UserError {
    constructor() {
        super('Invalid email address.', 'INVALID_EMAIL_ERROR')
    }
}

class InsecurePasswordError extends UserError {
    constructor() {
        super(
            'Passwords must be at least 6 characters long.',
            'INSECURE_PASSWORD_ERROR',
        )
    }
}

export { EmailTakenError, InvalidEmailError, InsecurePasswordError }
export default UserError
