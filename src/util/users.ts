interface User {
    balance : number
}

interface Price {
    minPrice_t: number,
    minPrice_nt: number
}

const users : Record <string, User> = {
    'user1': {balance: 1000},
    'user2': {balance: 2000},
    'user3': {balance: 3000}
}

export const csItems : Record <string, Price> = {}

export default users;