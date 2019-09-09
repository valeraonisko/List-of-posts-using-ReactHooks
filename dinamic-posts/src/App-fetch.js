import React, { useState, useEffect } from 'react';
import PostList from './components/PostList';

const serverUrl = 'https://jsonplaceholder.typicode.com/';

function sendRequest(url, handler) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', handler(request));
  request.send();
}

function App (props) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(null);
  const [users, setUsers] = useState(null);
  const [comments, setComments] = useState(null);
  const [postList, setPostList] = useState(null);

  function isLoaded() {
    return postList !== null;
  }

  function isLoading() {
    return !posts || !users || !comments;
  }

  function loadData() {
    setLoading(true);
    fetch(`${serverUrl}posts`)
      .then(requestPostsHandler);
    fetch(`${serverUrl}users`)
      .then(requestUsersHandler);
    fetch(`${serverUrl}comments`)
      .then(requestCommentsHandler);
  }

  function requestPostsHandler(response) {
    console.log('posts', response);
    response.json()
      .then(postsList => setPosts(postsList))
  }

  const requestUsersHandler = response => {
    response.json()
      .then(usersList => setUsers(usersList))
  }

  const requestCommentsHandler = response => {
    response.json()
      .then(commentsList => setComments(commentsList))
  }

  function checkData() {
    if (isLoading) return;
    const postsListMap = posts.map(post => ({...post,
      user: users.find(user => user.id === post.userId),
      postComments: comments.filter(comment => comment.postId === post.id) }));
    console.log('checkData', postsListMap);
    setPostList(postsListMap);
    setLoading(false);
  }

  useEffect(() => {
    if (!loading && !isLoaded()) {
      loadData();
      return;
    }
    if (loading) {
      checkData();
      return;
    }
  }, [loading, posts, users, comments]);

  return (
      <div className="App">
        <h1>Post List</h1>
      {isLoaded ? (<PostList posts={postList} />) : (<p>Loading...</p>)}
      </div>
    );
}

export default App;
