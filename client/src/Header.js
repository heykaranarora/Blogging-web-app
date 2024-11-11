import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext'
import {useContext} from 'react';

const Header = () => {
  const {setUserInfo,userInfo}=useContext(UserContext);
  
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include'
    }).then(response=>{
        return response.json().then(userInfo=>{
            setUserInfo(userInfo);
        });
      
    })
  }, []);


  const logout = async () => {
    await fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST'
    });
    setUserInfo(null);
  }

  const username=userInfo?.name;
  return (
    <div>
        <header>
        <Link to="/" className="logo">
          MyBlogs
        </Link>
        <nav>
        {username && (
          <>
          <span>Hello {userInfo?.name}</span>
          <Link to="/create">Create New Post</Link>
          <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          </>
        )
        }
        </nav>
      </header>
    </div>
  )
}

export default Header
