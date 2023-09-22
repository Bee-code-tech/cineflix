import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { NextPageContext    } from 'next';
import { getSession, signOut } from 'next-auth/react';
import useCurrentUser from '../hooks/useCurrentUser';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if(!session){
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }
  return {
    props: {}
  }
}

const Home: NextPage = () => {
  const {data: user} = useCurrentUser();
  return (
    <>
   <p className=" text-3xl text-blue-500">Cineflix</p>
   <p className='text-white'>login as {user?.name} with emal {user?.email}</p>
   <button onClick={() => signOut() } className='text-black bg-white w-auto p-4 mt-8' 
   >Logout</button> 
   </>
  )
}

export default Home
