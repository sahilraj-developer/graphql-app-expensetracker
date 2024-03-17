import {users} from '../dummyData/data.js'

const transactionResolver = {
    Query:{
        transactions:async(_,__, context)=>{
            try{
                if(!context.getUser())
                throw new Error("Unauthorized");
                const userId = await context.getUser()._id;

                const transaction = await Transaction.find({userId:userId});
                return transaction;

            }catch(error){
                console.log("error getting transactions:",error);
                throw new Error("Error getting transaction"); 
            }
        },
        transaction:async(_,{ transactionId},)=>{
        try{
            const transaction = await Transaction.findById(transactionId);
            return transaction;
        }catch(error){
            console.log("error getting transaction:",error);
                throw new Error("Error getting transaction"); 

        }
        }
    },
    Mutation:{
        createTransaction: async(_,{input},context) =>{
            try{
                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id
                })

                await newTransaction.save();
                return newTransaction;
            }catch(error){
                console.log("error Creating  transaction:",error);
                throw new Error("Error Creating transaction"); 
            }
        },
        updateTransaction: async(_,{input})=>{
            try{
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});
                return updatedTransaction;

            }catch(error){
                console.log("error Updating  transaction:",error);
                throw new Error("Error Updating transaction"); 
            }

        },
        deleteTransaction: async(_,{transactionId})=>{
            try{
                const deleteTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deleteTransaction;

            }catch(error){
                console.log("error Deleting  transaction:",error);
                throw new Error("Error Deleting transaction"); 
            }
        },


    }
}
export default transactionResolver