import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="image">
      <Link to={`/post/${post._id}`}>
        <img src={'http://localhost:4000/'+post.cover} alt="Description" />
      </Link>
      </div>
      <div className="texts">
      <Link to={`/post/${post._id}`}>
        <h2>{post.title}</h2>
        </Link>
        <p className="info">
          <a className="author">{post.author?.name}</a>
          <time>{format(new Date(post.createdAt), 'MMM d, yyyy HH:mm')}</time>
        </p>
        <p className="summary">{post.summary}</p>
      </div>
    </div>
  );
};

export default Post;
