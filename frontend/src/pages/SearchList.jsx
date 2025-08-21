import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import BlogCard from '../components/BlogCard'; // make sure this is imported

const SearchList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q');
  const { blog } = useSelector((store) => store.blog);

  const filteredBlogs = blog.filter((blog) => {
    const title = blog?.title?.toLowerCase() || "";
    const subtitle = blog?.subtitle?.toLowerCase() || "";
    const category = blog?.category?.toLowerCase() || "";
    const search = query?.toLowerCase() || "";

    return (
      title.includes(search) ||
      subtitle.includes(search) ||
      category === search
    );
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='pt-32'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='mb-5'>Search result for: "{query}"</h2>
        <div className='grid grid-cols-3 gap-7 my-10'>
          {filteredBlogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchList
