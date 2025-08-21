import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { LuSend } from "react-icons/lu";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { BsThreeDots } from "react-icons/bs";
import { Edit, Trash2 } from "lucide-react";

const CommentBox = ({ selectedBlog }) => {
    const { user } = useSelector((store) => store.auth);
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    // Fetch all comments on mount or when blog changes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/v1/comment/${selectedBlog._id}/comment/all`
                );
                setComments(res.data.comments || []);
            } catch (error) {
                console.error(error);
                setComments([]);
            }
        };
        fetchComments();
    }, [selectedBlog._id]);

    // Handle posting comment with optimistic update
    const commentHandler = async () => {
        if (!content.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        // Create a temporary comment for immediate UI update
        const tempId = Date.now().toString();
        const tempComment = {
            _tempId: tempId,
            content,
            userId: {
                _id: user?._id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                photoUrl: user?.photoUrl,
            },
            numberOfLikes: 0,
            createdAt: new Date().toISOString(),
        };

        // Optimistically show comment in UI
        setComments((prev) => [tempComment, ...prev]);
        setContent("");

        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/comment/${selectedBlog._id}/create`,
                { content },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            if (res.data.success) {
                // Replace temp comment with server comment
                setComments((prev) =>
                    prev.map((c) => (c._tempId === tempId ? res.data.comment : c))
                );
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Comment not added");
            // Remove temp comment if API call fails
            setComments((prev) => prev.filter((c) => c._tempId !== tempId));
        }
    };

    // Delete comment 
    const deleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/comment/${commentId}/delete`,{
                withCredentials:true
            })
            if(res.data.success){
                setComments((prev) => prev.filter((item) => item._id !== commentId));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Comment not deleted");
        }
    }

    const editCommentHandler = async(commentId)=>{
        try {
          const res = await axios.put(`http://localhost:8000/api/v1/comment/${commentId}/edit`, {content:editedContent},{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
          });
          if(res.data.success){
            const updatedComments = comments.map(item=>
                item._id === commentId ? {...item, content:editedContent} : item
            );
            setComments(updatedComments);
            toast.success(res.data.message)
            setEditingCommentId(null)
            setEditedContent("")
          }  
        } catch (error) {
            console.log(error);
            toast.error("Failed to edit comment");
        }
    };

    const likeCommentHandler = async (commentId) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/comment/${commentId}/like`,{
                withCredentials:true
            });
            if(res.data.success){
                const updatedComment = res.data.updatedComment;

                const updatedCommentList = comments.map(item=>
                    item._id === commentId ? updatedComment : item
                );
                setComments(updatedCommentList);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error liking comment", error);
            toast.error("Something went wrong");
        }
    }

    return (
        <div>
            {/* User info */}
            <div className="flex gap-4 mb-4 items-center">
                <Avatar>
                    <AvatarImage src={user?.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">
                    {user?.firstName} {user?.lastName}
                </h3>
            </div>

            {/* Comment input */}
            <div className="flex gap-3">
                <Textarea
                    placeholder="Leave a comment"
                    className="bg-gray-100 dark:bg-gray-800"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Button onClick={commentHandler}>
                    <LuSend />
                </Button>
            </div>

            {/* Comments list */}
            {comments.length > 0 && (
                <div className="mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md">
                    {comments
                        .filter(Boolean)
                        .map((item) => (
                            <div key={item._id || item._tempId} className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3 items-start">
                                        <Avatar>
                                            <AvatarImage src={item?.userId?.photoUrl} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="mb-2 space-y-1 md:w-[400px]">
                                            <h1 className="font-semibold">
                                                {item?.userId?.firstName} {item?.userId?.lastName}
                                                <span className="text-sm ml-2 font-light">
                                                    {item?.createdAt
                                                        ? new Date(item.createdAt).toLocaleString()
                                                        : "just now"}
                                                </span>
                                            </h1>
                                            {
                                                editingCommentId === item?._id ? (
                                                    <>
                                                    <Textarea
                                                    value={editedContent}
                                                    onChange={(e)=>setEditedContent(e.target.value)}
                                                    className="mb-2 bg-gray-200 dark:bg-gray-700"
                                                    />
                                                    <div className="flex py-1 gap-2">
                                                        <Button onClick={()=>editCommentHandler(item._id)} >Save</Button>
                                                        <Button variant="outline" className="hover:bg-black" onClick={()=>setEditingCommentId(null)}>Cancel</Button>
                                                    </div>
                                                    </>
                                                ) : <p>{item?.content}</p>
                                            }
                                            
                                            <div className="flex gap-5 items-center">
                                                <div className="flex gap-2 items-center">
                                                    <div onClick={()=>likeCommentHandler(item._id)} className="flex gap-1 items-center cursor-pointer">
                                                        {
                                                            item?.likes?.includes(user._id) ? <FaHeart fill="red"/> : <FaRegHeart />
                                                        }
                                                        
                                                        <span>{item?.numberOfLikes ?? 0}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm cursor-pointer">Reply</p>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        user._id === item?.userId?._id ? <DropdownMenu>
                                            <DropdownMenuTrigger><BsThreeDots /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={()=>{
                                                    setEditingCommentId(item._id);
                                                    setEditedContent(item.content)
                                                }}><Edit/>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={()=>deleteComment(item._id)} className='text-red-500'><Trash2/>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> : null
                                    }
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default CommentBox;
