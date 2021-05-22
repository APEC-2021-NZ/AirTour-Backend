import admin from 'firebase-admin'

// See: https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
const auth =
    () =>
    async ({ req }) => {
        let token = req.headers.authorization
            ? req.headers.authorization.replace('Bearer ', '')
            : null

        if (!token) return

        try {
            return {
                user: await admin.auth().verifyIdToken(token),
            }
        } catch (e) {
            // Invalid token
        }
    }

export default auth
