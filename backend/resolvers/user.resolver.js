import {users} from '../dummyData/data.js'
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';

const userResolver = {
     Mutation:{
signUp:async(_,{input},context)=>{
    try{
        const {username,name,password,gender} = input;
        if(!username || !name || !password  || !gender){
            throw new Error("All fields are Required");
        } 
        const  existingUser = await User.findOne({username});
  
        if(existingUser){
            throw new Error("User Alredy Exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // https://avatar-placeholder.iran.liara.run/ 

        const boyProfilePic = `http://avatar-placeholder.iran.liara.run/public/boy/username=${username}`;
        const girlProfilePic = `http://avatar-placeholder.iran.liara.run/public/girl/username=${username}`;

        const newUser = new User({
            username,
            name,
            password:hashedPassword,
            gender,
            profilePicture:gender === "male" ?boyProfilePic :girlProfilePic, 
        })

        await newUser.save();
        await context.login(username)
        return newUser;

    }catch(error){
        console.log("Error in Signup:",error);
        throw new Error(error.message || "internal server Error");

    }
},

 login: async(_,{input},context)=>{
        try{
            const {username,password}=input;
            await context.authentication("graphql-local",{username,password})

            await context.login(user);
            return user

        }catch(error){
            console.log("Error in login ",error);
            throw new Error(error.message || "Internal server error");
        }

    },
    logout: async(_,__,context)=>{
        try{
            await context.logout();
            req.session.destroy((err)=>{
                if(err) throw err;
            })
            res.clearCookie("connect.sid");
            return {message :"Logged Out Successfully"};

        }catch(error){
            console.log("Error in Logout ",error);
            throw new Error(error.message || "Internal server error");
        }

    }
     },
    Query:{
        // parents,args,context,info
        authUser:async(_,__,context)=>{
            try{
                const user = await context.getUser()
                return user;

            }catch(error){
                console.log("Error in auth User ",error);
                throw new Error(error.message || "Internal server error");
            }

        },
        user:async(_,{userId})=>{
           try{
            const user = await User.findById(userID);
            return user;

           }catch(error){
            console.log("Error in User Query",error);
            throw new Error(error.message || "Error in Getting User ");
           }
        }
    },
   
}
export default userResolver