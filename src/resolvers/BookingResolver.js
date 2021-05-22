import User from '../models/User'
import admin from 'firebase-admin'
import Booking from '../models/Booking'
import { getUser } from './UserResolver'
import { AuthenticationError } from 'apollo-server-express'

const getBooking = async (id) => {
    let booking = await Booking.collection.get({ id })
    return modelToBooking(booking)
}

const modelToBooking = (booking) => {
    return {
        id: booking.id,
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

const modelsToBookings = (bookings) => bookings.map(modelToBooking)

const BookingResolver = {
    Query: {
        booking: async (parent, { bookingID }, context, info) => {
            if (!context.user) throw new AuthenticationError()
        },
        bookings: async (parent, args, context, info) => {
            if (!context.user) throw new AuthenticationError()
            const user = await getUser(context.user.uid)

            const bookingsTourist = (
                await Booking.collection
                    .where('tourist', '==', user.key)
                    .where('confirmedTourist', '==', true)
                    .where('confirmedGuide', '==', true)
                    .fetch()
            ).list
            const bookingsGuide = (
                await Booking.collection
                    .where('guide', '==', user.key)
                    .where('confirmedTourist', '==', true)
                    .where('confirmedGuide', '==', true)
                    .fetch()
            ).list
            const bookings = [...bookingsGuide, ...bookingsTourist]
            const sortedBookings = bookings.sort(
                (a, b) => b.startTime - a.startTime,
            )
            return modelsToBookings(sortedBookings)
        },
    },
    Mutation: {
        createBooking: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let {
                touristID,
                guideID,
                startTime,
                endTime,
                description,
                confirmedTourist,
                confirmedGuide,
                price,
            } = input

            if (touristID != context.user.uid && guideID != context.user.uid) {
                throw new AuthenticationError()
            }

            const tourist = await getUser(touristID)
            const guide = await getUser(guideID)

            let booking = Booking.init()
            booking.tourist = tourist.key
            booking.guide = guide.key
            booking.startTime = new Date(startTime)
            booking.endTime = new Date(endTime)
            booking.description = description
            booking.confirmedTourist = confirmedTourist
            booking.confirmedGuide = confirmedGuide
            booking.price = price
            booking.created = new Date()

            await booking.save()

            // TODO: Send notification/message that booking has been created

            return await getBooking(booking.id)
        },
        updateBooking: async (parent, { input }, context, info) => {
            if (!context.user) throw new AuthenticationError()

            let {
                startTime,
                endTime,
                description,
                confirmedTourist,
                confirmedGuide,
                price,
            } = input

            const booking = await getBooking(booking.id)

            if (
                booking.tourist.ref.id != context.user.uid &&
                booking.guide.ref.id != context.user.uid
            ) {
                throw new AuthenticationError()
            }

            booking.startTime = startTime
                ? new Date(startTime)
                : booking.startTime
            booking.endTime = endTime ? new Date(endTime) : booking.endTime
            booking.description = description
                ? description
                : booking.description
            booking.confirmedTourist = confirmedTourist
                ? confirmedTourist
                : booking.confirmedTourist
            booking.confirmedGuide = confirmedGuide
                ? confirmedGuide
                : booking.confirmedGuide
            booking.price = price ? price : booking.price

            await booking.upsert()

            // TODO: Send notification/message that booking has been updated

            return booking
        },
        booking: async (parent, { accept }, context, info) => {
            if (!context.user) throw new AuthenticationError()
            const booking = await getBooking(booking.id)
            if (booking.tourist.ref.id == context.user.uid) {
                booking.confirmedTourist ? accept : booking.confirmedTourist
            } else if (booking.guide.ref.id == context.user.uid) {
                booking.confirmedGuide ? accept : booking.confirmedGuide
            } else {
                throw new AuthenticationError()
            }

            await booking.upsert()

            // TODO: Send notification/message that booking has been accepted/declined

            if (accept) {
                if (booking.confirmedGuide && booking.confirmedTourist) {
                    // TODO: accepted message
                } else {
                    // TODO: waiting for other to accept
                }
            } else {
                // TODO: decline message
            }
            return booking
        },
    },
}

export { getBooking }
export default BookingResolver
