export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    userName: string
    address: {
        street: string
        city: string
        state: string
        zip: string
    }
    isAdmin: boolean
}