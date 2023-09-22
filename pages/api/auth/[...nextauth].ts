import NextAuth from 'next-auth';
import { compare } from 'bcrypt'
import Credentials from 'next-auth/providers/credentials';
import prismadb from '../../../lib/prismadb';
import GithubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@next-auth/prisma-adapter';

//@ts-ignore
export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || ''
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID || '',
            clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
             version: "2.0", // opt-in to Twitter OAuth 2.0
               }),
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
           async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
                throw new Error('Email and password required');
            }

            const user = await prismadb.user.findUnique({
                where: {
                    email : credentials.email
                }
            })
            if(!user || !user.hashedPassword){
                throw new Error('Email does not exist')
            }
            const isCorrectPassword = await compare(
                credentials.password, user.hashedPassword
                );
         if(!isCorrectPassword){
                throw new Error('Incorrect Password')
             }   
             return user;
           }
        })
    ],
    pages:{
        signIn: '/auth',
    },
    debug: process.env.NODE_ENV ==='development',
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },

    secret: process.env.NEXTAUTH_SECRET,
})

