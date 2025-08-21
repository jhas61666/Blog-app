import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Bookmark, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import CommentBox from "@/components/CommentBox";
import { setBlog } from "@/redux/blogSlice"; // ✅ make sure this is imported

const BlogView = () => {
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const blogId = params.blogId;
  const dispatch = useDispatch();

  const selectedBlog = Array.isArray(blog)
    ? blog.find((b) => b._id === blogId)
    : null;

  const [blogLike, setBlogLike] = useState(0);
  const [liked, setLiked] = useState(false);

  // ✅ safely set states when data is available
  useEffect(() => {
    if (selectedBlog && user) {
      setBlogLike(selectedBlog.likes?.length || 0);
      setLiked(selectedBlog.likes?.includes(user._id) || false);
    }
  }, [selectedBlog, user]);

  const changeTimeFormat = (isDate) => {
    if (!isDate) return "";
    const date = new Date(isDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this blog!",
          text: "Read this amazing blog post",
          url: blogUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error("Error Sharing:", err));
    } else {
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success("Blog Link copied to clipboard");
      });
    }
  };

  const likeOrDislikeHandler = async () => {
    if (!selectedBlog || !user) return;
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/blog/${selectedBlog._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
        setBlogLike(updatedLikes);
        setLiked(!liked);

        // update blog list in redux
        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ loading safeguard
  if (!selectedBlog) {
    return (
      <div className="pt-14 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    );
  }

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  return (
    <div className="pt-14 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-10 ">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blogs">Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* blog header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={selectedBlog.author?.photoUrl}
                  alt="author"
                />
                <AvatarFallback>
                  {selectedBlog.author?.firstName?.[0] ||
                    selectedBlog.author?.lastName?.[0] ||
                    "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedBlog.author?.firstName}{" "}
                  {selectedBlog.author?.lastName}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min
              read
            </div>
          </div>
        </div>

        {/* featured image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={selectedBlog.thumbnail}
            alt="thumbnail"
            width={1000}
            height={500}
            className="w-full object-cover"
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            {selectedBlog.subtitle}
          </p>
        </div>

        {/* description */}
        <p dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

        <div className="mt-10">
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="hover:bg-red-400">
              Node.js
            </Badge>
            <Badge variant="secondary" className="hover:bg-blue-400">
              React.js
            </Badge>
            <Badge variant="secondary" className="hover:bg-green-400">
              Web Development
            </Badge>
            <Badge variant="secondary" className="hover:bg-yellow-400">
              JavaScript
            </Badge>
          </div>

          {/* engagement */}
          <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={likeOrDislikeHandler}
                variant="ghost"
                className="flex items-center gap-1"
              >
                {liked ? (
                  <FaHeart
                    size={24}
                    className="cursor-pointer text-red-600"
                  />
                ) : (
                  <FaRegHeart
                    size={24}
                    className="cursor-pointer hover:text-gray-600 text-white"
                  />
                )}
                <span>{blogLike}</span>
              </Button>
              <Button variant="ghost">
                <MessageSquare className="h-4 w-4" />
                <span>1 Comments</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleShare(selectedBlog._id)}
                variant="ghost"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CommentBox selectedBlog={selectedBlog} />
      </div>
    </div>
  );
};

export default BlogView;
