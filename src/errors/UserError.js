import { ApolloError } from 'apollo-server-errors'

class UserError extends ApolloError {
    constructor(message = 'User error', code = 'USER_ERROR') {
        super(message, code)
    }
}

class EmailTakenError extends UserError {
    constructor() {
        super(
            'That email address is already associated with another account.',
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

class InvalidFirstNameError extends UserError {
    constructor() {
        super('A non-empty firstname is required.', 'INVALID_FIRSTNAME_ERROR')
    }
}

class InvalidSurnameError extends UserError {
    constructor() {
        super('A non-empty surname is required.', 'INVALID_SURNAME_ERROR')
    }
}

class UnderageError extends UserError {
    constructor() {
        super(
            'You must be at least 18 years old to register.',
            'UNDERAGE_ERROR',
        )
    }
}
export {
    EmailTakenError,
    InvalidEmailError,
    InsecurePasswordError,
    InvalidFirstNameError,
    InvalidSurnameError,
    UnderageError,
}
export default UserError
