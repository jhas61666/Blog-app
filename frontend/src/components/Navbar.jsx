import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Logo from "./../assets/logo.png";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { FaMoon, FaSun } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice.js';
import { setUser } from '../redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';
import userLogo from '../assets/Red rose.jpg'
import {HiMenuAlt1, HiMenuAlt3} from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import ResponsiveMenu from './ResponsiveMenu';


const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const { theme } = useSelector(store => store.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [openNav, setOpenNav] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleNav=()=>{
    setOpenNav(!openNav)
  }

  const handleSearch = (e)=>{
    e.preventDefault();
    if(searchTerm.trim() !== ""){
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("")
    }
  }

  const logoutHandler = async (e) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/logout`, { withCredentials: true });
      if (res.data.success) {
        navigate('/')
        dispatch(setUser(null))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }
  return (
    <div className='py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50'>
      <div className='max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0'>
        {/* logo section */}
        <div className='flex gap-7 items-center'>
          <Link to={'/'}>
            <div className='flex gap-2 itens-center'>
              <img src={Logo} alt="#" className='w-9 h-9 md:w-10 md:h-10 dark:invert rounded-full object-cover' />
              <h1 className='font bold text-3xl md:text-4xl hidden md:block'>Logo</h1>
            </div>
          </Link>
          <div className='relative hidden md:block'>
            <Input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              className='border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block'

            />
            <Button onClick={handleSearch} className='absolute right-0 top-0'><Search /></Button>
          </div>
        </div>
        {/* nav section */}
        <nav className='flex md:gap-7 gap-4 items-center'>
          <ul className='hidden md:flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/blogs'}><li>Blogs</li></Link>
            <Link to={'/about'}><li>About</li></Link>
          </ul>
          <div className='flex'>
            <Button onClick={() => dispatch(toggleTheme())}>
              {
                theme === 'light' ? <FaMoon /> : <FaSun />
              }
            </Button>
            {
              user ? <div className='ml-2  flex gap-3 items-center'>




                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 mr-1 " >
                    <Avatar >
                      <AvatarImage src={user.photoUrl || userLogo} className="w-full h-full object-cover" />
                      <AvatarFallback className="flex items-center justify-center text-xs font-medium bg-gray-200 w-full h-full rounded-full">CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                        👤 Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/your-blog')}>
                        📷 Your Blogs
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/comments')}>
                        💬 Comments
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/write-blog')}>
                       📝 Write Blog
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>🐙 GitHub</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>
                      🔓 Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="hidden md:block" onClick={logoutHandler}>Logout</Button>
              </div> : <div className='ml-7 md:flex gap-2'>
                <Link to={"/login"}><Button>Login</Button></Link>
                <Link className='hidden md:block' to={"/signup"}><Button>Signup</Button></Link>
              </div>
            }
          </div>
          {
            openNav ? <HiMenuAlt3 onClick={toggleNav} className='w-7 h-7 ml-1 mr-1 md:hidden'/>:<HiMenuAlt1 onClick={toggleNav} className='w-7 h-7 mr-1 ml-1 md:hidden'/>
          }
        </nav>
          <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler} />
      </div>
    </div>
  )
}

export default Navbar