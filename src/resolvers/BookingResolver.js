import User from '../models/User';
import admin from 'firebase-admin';

const BookingResolver = {
    Query: {
        booking: async (parent, { bookingID }, context, info) => {
            // TODO
        },
        bookings: async (parent, args, context, info) => {
            // TODO
        },
    },
    Mutation: {
        createBooking: async (parent, { input }, context, info) => {
            // TODO
        },
        updateBooking: async (parent, { input }, context, info) => {
            // TODO
        },
        booking: async (parent, { accept }, context, info) => {
            // TODO
        },
    }
};

export default BookingResolver;
