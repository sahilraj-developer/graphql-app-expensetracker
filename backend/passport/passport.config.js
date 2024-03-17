import passport from "passport";
import bcrypt from 'bcryptjs';
import User from "../models/user.models.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async ()=>{
    passport.serializeUser((user, done)=>{
        console.log("serialize User")
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done)=>{
        console.log("deserializing user")

        try{
            const user = await User.findById(id);
            done(null,user)
            
        }catch(error){
             done(error)
        }
    });
    passport.use(
        new GraphQLLocalStrategy(async (username,passport,done)=>{
            try{
                const user = await User.findOne({username});
                if(!user){
                    throw new Error("Invalid Username Or Password")
                }
                const validPassport = await bcrypt.compare(password,user.password);
               if(!validPassport){
                throw new Error("Invalid username or Password")
               } 

               return done(null,user);

            }catch(error){
                return done(error)
            }
        })
    )
}