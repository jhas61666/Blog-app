import { Card } from '../components/ui/card'
import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const YourBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = useSelector(store => store.blog);

  // ✅ Fetch own blogs
  const getOwnBlog = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/blog/get-own-blogs`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setBlog(Array.isArray(res.data.blogs) ? res.data.blogs : []));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs");
    }
  };

  // ✅ Delete blog
  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/blog/delete/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedBlogData = blog.filter((b) => b?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getOwnBlog();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900  bg-gray-100">
      {/* Wrapper ensures no black space */}
      <div className="flex-grow pt-20 pb-10 px-2 md:ml-[300px]">
        <div className="max-w-6xl h-full mx-auto">
          <Card className="w-full p-3 md:p-5 space-y-2 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of your recent blogs.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(blog) && blog.length > 0 ? (
                    blog.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="flex gap-4 items-center">
                          <img
                            src={item.thumbnail}
                            className="w-16 rounded-md hidden sm:block"
                            alt="thumbnail"
                          />
                          <h1
                            onClick={() => navigate(`/blogs/${item._id}`)}
                            className="hover:underline cursor-pointer w-[120px] sm:w-full truncate"
                          >
                            {item.title}
                          </h1>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <BsThreeDotsVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/dashboard/write-blog/${item._id}`)
                                }
                              >
                                <Edit /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => deleteBlog(item._id)}
                              >
                                <Trash2 className="text-red-500" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No blogs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YourBlog;
