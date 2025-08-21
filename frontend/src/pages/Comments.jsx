import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import axios from 'axios';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Comments = () => {
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState([]);

  const getTotalComments = async () => {
    try {
      const res = await axios.get(
        `https://blog-app-9g6i.onrender.com/api/v1/comment/my-blogs/comments`,
        { withCredentials: true }
      );

      console.log("API Response:", res.data);

      if (res.data.success) {
        // ✅ Correct key is "comments", not "Comments"
        // ✅ Reverse so newest appears first
        setAllComments(res.data.comments?.reverse() || []);
      } else {
        setAllComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setAllComments([]);
    }
  };

  useEffect(() => {
    getTotalComments();
  }, []);

  return (
    <div className="h-full pt-2 px-4  mt-15 mb-0 p-2 md:ml-[300px] md:h-screen dark:bg-gray-900 justify-center">
      <div className=" w-full h-full max-w-6xl  mt-1 ml-0">
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your recent comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-extrabold">Blog Title</TableHead>
                <TableHead className="font-extrabold">Comment</TableHead>
                <TableHead className="font-extrabold">Author</TableHead>
                <TableHead className="text-center font-extrabold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(allComments) && allComments.length > 0 ? (
                allComments.map((comment, index) => (
                  <TableRow key={comment?._id || index}>
                    <TableCell className="font-medium">
                      <h1 className='w-[75px] truncate md:w-full'>{comment?.postId?.title || "No Title"}</h1>
                    </TableCell>
                    <TableCell>{comment?.content || "No Content"}</TableCell>
                    <TableCell>{comment?.userId?.firstName || "Unknown"}</TableCell>
                    <TableCell className="text-right flex gap-3 items-center justify-center">
                      <Eye
                        className="cursor-pointer"
                        onClick={() => navigate(`/blogs/${comment?.postId?._id}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No comments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div> 
  );
};

export default Comments;
