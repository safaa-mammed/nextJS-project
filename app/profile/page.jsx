'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname,useSearchParams } from 'next/navigation'

import Profile from '@components/Profile'

const UserProfile = () => {
    const router = useRouter();
    const pathName = usePathname();
    //entering other user profile
    const searchParams = useSearchParams();
    const userId = searchParams.get('id')
    const name = searchParams.get('name')

    const { data: session } = useSession();

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
          const response = await fetch(`/api/users/${userId}/posts`);
          const data = await response.json();
    
          setPosts(data);
        }
        if(userId)
            fetchPosts();
      }, [])

    const handleEdit = (posts) => {
      router.push(`/update-prompt?id=${posts._id}`)
    }
    const handleDelete = async (post) => {
      const hasConfirmed = confirm('Are you sure you want to delete this prompt?')
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE'
        })
        const filteredPosts = posts.filter((p) => p._id !== post._id)
        
        if(hasConfirmed)
          setPosts(filteredPosts)
      } catch (error) {
        console.log(error) 
      }
    }

  return (
    <div>
      {session?.user.id === userId && pathName === '/profile' ? (
        <Profile
        name='My'
        desc="Welcome to your personalized profiled page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      ) : (
        <Profile
        name={name.toUpperCase()}
        desc="Welcome to your personalized profiled page"
        data={posts}
      />
      ) }
    
    </div>

    
  )
}

export default UserProfile