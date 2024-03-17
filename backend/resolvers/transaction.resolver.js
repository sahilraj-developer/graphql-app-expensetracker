import {users} from '../dummyData/data.js'

const transactionResolver = {
    Query:{
        users:()=>{
            return users
        }
    },
    Mutation:{}
}
export default transactionResolver