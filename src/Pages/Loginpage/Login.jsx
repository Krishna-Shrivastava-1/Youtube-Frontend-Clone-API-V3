
import React, { useState } from 'react'
import { signin, signup } from '../../Firebase/Firebaselogin'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const [login, setlogin] = useState('Signup')
    const [username, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const handlesubmit = async (e) => {
        e.preventDefault()  // Fix typo here
        try {
            if (login === 'Signup') {
                // Call signup function with username, email, and password
                await signup(username, email, password)
                // Navigate to home after signup
                navigate('/home')
            } else {
                // Call signin function with email and password
                await signin(email, password)
                // Navigate to home after login
                navigate('/home')
            }
        } catch (error) {
            console.log('Error:', error)
        }
    }

    return (
        <div>
            <div>

            </div>

            <div className='flex items-center justify-center h-screen p-3'>
                <div className='bg-neutral-900 p-2 w-[90%] md:w-[35%] rounded-lg'>
                    <h1 className='text-white font-extrabold text-2xl'>{login}</h1>
                    <form onSubmit={handlesubmit} className='flex flex-col items-center justify-center gap-2 w-full'>
                        {
                            login === 'Signup' && (
                                <input
                                    onChange={(e) => setusername(e.target.value)}
                                    className='text-lg border-none outline-none bg-zinc-700 text-white p-2 m-2 rounded-md w-full'
                                    type="text"
                                    required
                                    placeholder='Fullname'
                                />
                            )
                        }
                        <input
                            onChange={(e) => setemail(e.target.value)}
                            className='text-lg border-none outline-none bg-zinc-700 text-white p-2 m-2 rounded-md w-full'
                            type="email"
                            required
                            placeholder='Email'
                        />
                        <input
                            onChange={(e) => setpassword(e.target.value)}
                            className='text-lg border-none outline-none bg-zinc-700 text-white p-2 m-2 rounded-md w-full'
                            type="password"
                            required
                            placeholder='Password'
                        />
                        <button
                            className='shadow-lg shadow-red-700 text-center text-white text-xl bg-red-600 hover:bg-red-800 transition-all duration-300 w-full p-1 rounded-md font-semibold cursor-pointer'
                            type='submit'
                        >
                            {login === 'Signup' ? 'Create Account' : 'Login Account'}
                        </button>
                        {
                            login === 'Signup' ? <p onClick={() => setlogin('Login')} className='text-white text-lg' >Do you Already have an account? <span className='text-sky-600 hover:text-sky-400 transition-all duration-200 cursor-pointer hover:underline '> Login Here</span></p> :
                                <p onClick={() => setlogin('Signup')} className='text-white text-lg' >Create an account? <span className='text-sky-600 hover:text-sky-400 transition-all duration-200 cursor-pointer hover:underline '>Signup Here</span></p>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
