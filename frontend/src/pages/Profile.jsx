import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Card } from '../components/ui/card'
import React, { useState } from 'react'
import profilePic from '../assets/profilePic.jpeg'
import { Link } from 'react-router-dom'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2, User } from 'lucide-react'
import { setLoading, setUser } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import TotalProperty from '../components/TotalProperty'

const Profile = () => {
  const [open, setOpen] = useState(false)
  const { user, loading } = useSelector(store => store.auth)

  const dispatch = useDispatch();
  const [input, setInput] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    occupation: user?.occupation,
    bio: user?.bio,
    facebook: user?.facebook,
    linkedin: user?.linkedin,
    github: user?.github,
    instagram: user?.instagram,
    file: user?.photoUrl
  })

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const changeFileHandler = (e) => {
    setInput(prev => ({
      ...prev,
      file: e.target.files?.[0]
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("linkedin", input.linkedin);
    formData.append("github", input.github);
    formData.append("instagram", input.instagram);
    if (input?.file) {
      formData.append("file", input?.file)
    }

    console.log(input);

    try {
      dispatch(setLoading(true))
      const res = await axios.put(`https://blog-app-9g6i.onrender.com/api/v1/user/profile/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      })
      if (res.data.success) {
        setOpen(false)
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false))
    }
  }
  return (
    <div className='pt-16 md:ml-[300px] md:h-screen dark:bg-gray-900'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className='flex flex-col items-center justify-center md:w-[400px]'>
            <Avatar className='w-40  border-2 rounded-full '>
              <AvatarImage src={user.photoUrl || profilePic} className='rounded-full' />
            </Avatar>
            <h1 className='text-center font-semibold text-xl text-gray-700 dark:text-gray-300 mt-3'>{user.occupation || "Mern Stack Developer"}</h1>
            <div className='flex gap-4 items-center'>
              <Link><FaFacebook className='w-6 h-6 text-gray-800 dark:text-gray-300 mt-2' /></Link>
              <Link><FaLinkedin className='w-6 h-6 text-gray-800 dark:text-gray-300 mt-2' /></Link>
              <Link><FaGithub className='w-6 h-6 text-gray-800 dark:text-gray-300 mt-2' /></Link>
              <Link><FaInstagram className='w-6 h-6 text-gray-800 dark:text-gray-300 mt-2' /></Link>
            </div>
          </div>
          {/* info section */}
          <div>
            <h1 className='font-bold text-center md:text-start text-4xl mb-7'>Welcome {user.firstName || User} !</h1>
            <p><span className='font-semibold'>Email :</span> {user.email}</p>
            <div className='flex flex-col gap-2 items-start justify-start my-5'>
              <Label className='flex font-semibold '>About Me</Label>
              <p className='border  dark:border-gray-600 rounded-lg pt-1 pl-1 pr-1 pb-1'>{user.bio || "I am a passionate and detail-oriented Full-Stack Developer with a strong foundation in the MERN stack (MongoDB, Express.js, React, Node.js) and hands-on experience building responsive, user-friendly web applications. My expertise spans frontend design, backend development, API integration, and deployment using Github, Netlify and Render."}</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <form>

                <Button type="button" onClick={() => setOpen(true)} >Edit profile</Button>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center">Edit profile</DialogTitle>
                    <DialogDescription className="text-center">
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className='flex gap-2'>
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">First Name</Label>
                        <Input id="name-1" name="firstName" placeholder="firstname" type='text' className='text-gray-500' value={input.firstName} onChange={changeEventHandler} />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Last Name</Label>
                        <Input id="username-1" name="lastName" placeholder="lastname" type='text' className='text-gray-500' value={input.lastName} onChange={changeEventHandler} />
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Facebook</Label>
                        <Input id="facebook" name="facebook" placeholder="Enter a URL" type='text' className='text-gray-500' value={input.facebook} onChange={changeEventHandler} />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Instagram</Label>
                        <Input id="instagram" name="instagram" placeholder="Enter a URL" type='text' className='text-gray-500' value={input.instagram} onChange={changeEventHandler} />
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Linkedin</Label>
                        <Input id="linkedin" name="linkedin" placeholder="Enter a URL" type='text' className='text-gray-500' value={input.linkedin} onChange={changeEventHandler} />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Github</Label>
                        <Input id="github" name="github" placeholder="Enter a URL" type='text' className='text-gray-500' value={input.github} onChange={changeEventHandler} />
                      </div>
                    </div>
                    <div>
                      <Label className=' mb-2'>Description</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Enter a description here"
                        className="col-span-3 text-gray-500"
                        value={input.bio} onChange={changeEventHandler}
                      />
                    </div>
                    <div>
                      <Label className='mb-2'>Picture</Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        className='w-[277px]'
                        onChange={changeFileHandler}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={submitHandler} type="submit">
                      {
                        loading ? (
                          <>
                            <Loader2 className='mr-2 w-4 h-4 anomate-spin' />
                            Please wait
                          </>
                        ) : ("Save changes")
                      }
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </Card>
      </div>
      <TotalProperty/>
    </div>
  )
}

export default Profile