'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const PromptCardList = ({data, handleTagClick, handleProfileClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) =>
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      )}
    </div>
  )
}

const Feed = () => {
  const router = useRouter();
  const [searchText, setsearchText] = useState('');
  const [posts, setPosts] = useState([])
  const [searchResults, setsearchResults] = useState([])

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setPosts(data);
  }

  const handleSearchChange = (e) => {
    setsearchText(e.target.value);
    const result = searchFunction(e.target.value);
    setsearchResults(result);
    
  }
  const handleTagClick = (tagName) => {
    setsearchText(tagName);
    const result = searchFunction(tagName);
    setsearchResults(result);
  }
  const searchFunction = (searchtext) => {
    //search through prompt, tag, username
    return posts.filter((p) => p.prompt.includes(searchtext) || p.tag.includes(searchtext) || p.creator.username.includes(searchtext))
    
  }
  const handleProfileClick = (data) => {
    const userId = data.creator._id.toString()
    const username = data.creator.username.toString()
    router.push(`/profile?id=${userId}&name=${username}`)
  }
  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a prompt, tag or username'
          value={searchText}
          onChange={handleSearchChange}
          className='search_input peer'
        />
      </form>
      {searchText ? (
        <PromptCardList
        data={searchResults}
        handleTagClick={handleTagClick}
        handleProfileClick={handleProfileClick}
      />
      ) : (
      <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
        handleProfileClick={handleProfileClick}
      />
      )}
      
    </section>
  )
}

export default Feed