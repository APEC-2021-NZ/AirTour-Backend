import User from '../models/User'
import admin from 'firebase-admin'
import Booking from '../models/Booking'

export const getBooking = async (id) => {
    let booking = await Booking.collection.get({ id })
    return {
        id,
        guideID: booking.guide.ref.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        description: booking.description,
        confirmedTourist: booking.confirmedTourist,
        confirmedGuide: booking.confirmedGuide,
        price: booking.price,
        created: booking.created,
    }
}

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
    },
}

export default BookingResolver
