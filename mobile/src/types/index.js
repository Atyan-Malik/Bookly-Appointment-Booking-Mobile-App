// types/index.js
// This project uses JavaScript, not TypeScript, so these are JSDoc typedefs —
// they give editor autocomplete and inline docs without a build step. Import
// with: /** @type {import('../types').Professional} */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {'customer'|'provider'|'admin'} role
 * @property {string} [phone]
 * @property {string} [avatar]
 * @property {{ address?: string, city?: string, coordinates?: { lat: number, lng: number } }} [location]
 */

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 */

/**
 * @typedef {Object} Professional
 * @property {string} _id
 * @property {User} user
 * @property {string} profession
 * @property {Category} category
 * @property {string} bio
 * @property {number} experienceYears
 * @property {'male'|'female'|'other'} gender
 * @property {string[]} images
 * @property {{ address?: string, city?: string, coordinates?: { lat: number, lng: number } }} location
 * @property {number} rating
 * @property {number} reviewCount
 * @property {number} startingPrice
 * @property {boolean} isVerified
 */

/**
 * @typedef {Object} Service
 * @property {string} _id
 * @property {string} professional
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} durationMinutes
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} time  // "HH:mm"
 * @property {boolean} available
 */

/**
 * @typedef {'PENDING'|'CONFIRMED'|'COMPLETED'|'CANCELLED'|'NO_SHOW'} AppointmentStatus
 */

/**
 * @typedef {Object} Appointment
 * @property {string} _id
 * @property {User} customer
 * @property {Professional} professional
 * @property {Service} service
 * @property {string} date  // "YYYY-MM-DD"
 * @property {string} startTime  // "HH:mm"
 * @property {string} endTime
 * @property {number} durationMinutes
 * @property {number} price
 * @property {AppointmentStatus} status
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Review
 * @property {string} _id
 * @property {User} customer
 * @property {string} professional
 * @property {string} appointment
 * @property {number} rating
 * @property {string} [comment]
 */

/**
 * @typedef {Object} Notification
 * @property {string} _id
 * @property {string} user
 * @property {string} type
 * @property {string} title
 * @property {string} message
 * @property {boolean} isRead
 * @property {Object} [data]
 */

/**
 * @typedef {Object} Pagination
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} pages
 */

/**
 * @typedef {Object} ApiSuccessResponse
 * @property {true} success
 * @property {string} message
 * @property {*} data
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {false} success
 * @property {string} message
 * @property {string[]} [errors]
 */

// Exported as an empty object so this file can still be imported without
// bundlers complaining about a module with no runtime exports.
export default {};
