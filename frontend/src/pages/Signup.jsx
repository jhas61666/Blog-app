import React, { useState } from 'react'
import auth from "../assets/loginImg.png"
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/authSlice'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const {loading} = useSelector(store=>store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:""
  })
  const handleChange = (e) => {
   

    const {name, value} = e.target 
    setUser((prev) => ({
      ...prev,
      [name] : value
    }));
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(user);

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`http://localhost:8000/api/v1/user/register`, user,{
        headers: {
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      if(res.data.success){
        navigate('/login')
        toast.success(res.data.message || "Account created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false))
    }
  }
  return (
    <div className='flex h-screen md:pt-14 md:h-[760px]'>
      <div className='hidden md:block'>
        <img src={auth} alt="" className='h-[600px] ' />
      </div>
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
        <Card className='w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600'>
          <CardHeader>
            <CardTitle>
              <h1 className='text-center text-xl font-semibold'>Create an account</h1>
            </CardTitle>
            <p className='mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to create your account</p>
          </CardHeader>
          <CardContent>
            <form action="" className='space-y-4 ' onSubmit={handleSubmit}>
              <div className='flex gap-3'>
                <div>
                  <Label>First Name</Label>
                  <Input type="text"
                    placeholder="First Name"
                    name="firstName"
                    className="dark:border-gray-600 dark:bg-gray-900 mt-2"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input type="text"
                    placeholder="Last Name"
                    name="lastName"
                    className="dark:border-gray-600 dark:bg-gray-900 mt-2"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  name="email"
                  className="dark:border-gray-600 dark:bg-gray-900 mt-2"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div className='relative'>
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  name="password"
                  className="dark:border-gray-600 dark:bg-gray-900 mt-2"
                  value={user.password}
                  onChange={handleChange}
                />
                <button onClick={() => setShowPassword(!showPassword)} type="button" className='absolute right-3 top-8 text-gray-500'>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20}/>}
                </button>
              </div>
              <Button type="submit" className="w-full">
                {
                  loading ? (
                    <>
                    <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                    please wait...
                    </>
                  ) : ("Sign Up")
                }
              </Button>
              <p className='text-center text-gray-600 dark:text-gray-300'>Already have an account? <Link to={'/login'}><span className='underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-800'>Login</span></Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Signup