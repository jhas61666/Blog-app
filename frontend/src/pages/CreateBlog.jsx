import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setBlog, setLoading } from '@/redux/blogSlice'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { blog, loading } = useSelector(store => store.blog)

  console.log(blog);

  const getSelectedCategory = (value) => {
    setCategory(value)
  }

  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`https://blog-app-9g6i.onrender.com/api/v1/blog/`, { title, category }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        if(!blog){
          dispatch(setBlog([res.data.blog]))
          navigate(`/dashboard/write-blog/${res.data.blog._id}`)
          toast.success(res.data.message)
        }
        dispatch(setBlog([...blog, res.data.blog]))
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
        toast.success(res.data.message)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error);

    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='p-8 md:pr-20 dark:bg-gray-900 h-screen md:ml-[300px] pt-20'>
      <Card className='md:p-10 p-4 dark:bg-gray-800 -space-y-6'>
        <h1 className='text-2xl font-bold'>Let's create blog</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <div className='mt-12'>
          <div>
            <Label>Title</Label>
            <Input type='text' placeholder="Your blog name" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white dark:bg-gray-700 mt-2" />
          </div>

          <div className='mt-4 mb-5'>
            <Label className='mb-2'>Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="photogaphy">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <Button disabled={loading} onClick={createBlogHandler}className=''>
              {
                loading ? <><Loader2 className='mr-1 h-4 w-4 animate-spin'/>Please wait</> : "Create"
              }
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CreateBlog