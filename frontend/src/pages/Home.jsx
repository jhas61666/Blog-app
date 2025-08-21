import React from 'react'
import Hero from '../components/Hero'
import RecentBlog from '@/components/RecentBlog'
import PopularAuthors from '@/components/PopularAuthors'

const Home = () => {
  return (
    <div className='pt-14'>
      <Hero/>
      <RecentBlog/>
      <PopularAuthors/>
      
    </div>
  )
}

export default Home