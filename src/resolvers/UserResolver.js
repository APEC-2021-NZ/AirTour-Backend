// Dummy data
const users = [
    {
        name: 'Human',
        email: 'hooman@hoomans.com'
    },
    {
        name: 'Hooman',
        email: 'human@humans.com'
    },
];

export const UserResolver = {
    Query: {
        users: () => users
    }
}