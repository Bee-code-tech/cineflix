import axios from "axios";
import Input from "../components/Input";
import {useCallback, useState} from 'react';
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router";
import {CiTwitter} from 'react-icons/ci';
import {FaGithub} from 'react-icons/fa';


const Auth = () => {
  const router = useRouter();
const [email,setEmail] = useState('');
const [name,setName] = useState('');
const [password,setPassword] = useState('');
const [variant, setVariant] = useState('login');

const toggleVariant = useCallback(() => {
  setVariant((currentVariant) => currentVariant === 'login' ? 'Register' : 'login')
}, []);

const login = useCallback(async () =>{
  try{
  await signIn('credentials', {
    email,
    password,
    redirect: false,
    callbackUrl: '/profiles'
  })
  
  router.push('/profiles')
  }catch(error){
    console.log('Login error:', error);
    
  }
}, [email, password, router])

const register = useCallback(async () => {
  try{
    await axios.post('../api/register', {
      name,
      email, 
      password
    })
    login();
  } catch (error) {
  console.log('Registration error:', error);
}

}, [email, name, password, login]);




  return (
    <div className="absolute w-full h-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-fixed bg-center">
       <div className="bg-black w-full h-full lg:bg-opacity-60  sm:bg-opacity-60 ">
        <nav className="px-12 py-5">
            <img src="/images/logo.png" alt="cineflix" className="h-9 mb-8 self-center" />
        </nav>
        <div className="flex justify-center">
            <div className="bg-black bg-opacity-90 px-16 py-16 self-center mt-2
            lg:w-2/5 lg:max-w-md rounded-md w-full sm:w-2/3
            ">
            <h2 className='text-white text-4xl mb-8 font-semibold'>
                { variant == 'login' ? 'Sign in' : 'Register' }
            </h2>
            <div className="flex flex-col gap-5">

              {variant == 'Register' && (  
                <Input 
                label="Username"
                onChange={(e: any)=> setName(e.target.value)}
                id='name'
                type="text"
                value={name}
                />
                )} 
                <Input 
                label="Email Address"
                onChange={(e: any)=> setEmail(e.target.value)}
                id='email'
                type="email"
                value={email}
                />

               

                  <Input 
                label="Password"
                onChange={(e: any)=> setPassword(e.target.value)}
                id='password'
                type="password"
                value={password}
                />

                <button onClick={variant === 'login' ? login: register} className="bg-blue-600 py-3 duration-150 hover:bg-blue-500 text-white rounded-md w-full mt-1">
               { variant == 'login' ? 'login' : 'Sign Up'}
                </button>
                 
                 <div className="flex flex-row items-center gap-4 mt-4 justify-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">

                  <CiTwitter 
                  className='text-white '
                  onClick={() => signIn('twitter', { callbackUrl: '/profiles'})}
                  
                  size={25}/>
                  </div>
                   <div className="w-10 h-10 bg-white  rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">

                  <FaGithub 
                  
                   onClick={() => signIn('github', { callbackUrl: '/profiles'})}
                  size={25} />
                  </div>
                 </div>

                <p className="text-neutral-500 mt">
                  {variant == 'login' ? 'First time using Cineflix?' : 'Already have an account'}
                  <span onClick={toggleVariant} className="text-white ml-2 cursor-pointer hover:underline">

                    {variant == 'login' ? 'Create an account': 'Login'}
                  </span>
                </p>
                
            </div>
            </div>
        </div>
       </div>
    </div>
  )
}

export default Auth;
