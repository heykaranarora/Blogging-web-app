import "./App.css";
import Header from "./Header";
import Layout from "./Layout";
import IndexPage from "./Pages/IndexPage.js";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./Pages/LoginPage.js";
import RegisterPage from "./Pages/RegisterPage.js";
import { UserContextProvider } from "./UserContext.js";
import CreatePost from "./Pages/CreatePost.js";
import PostPage from "./Pages/PostPage.js";
import EditPost from "./Pages/EditPost.js";

function App() {
  return (
    <UserContextProvider>
   <Routes>
   <Route path="/" element={<Layout/>}>
    <Route index element={<IndexPage/>}/>
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/register" element={<RegisterPage/>} />
    <Route path="/create" element={<CreatePost/>} />
    <Route path="/post/:id" element={<PostPage/>} />
    <Route path="/edit/:id" element={<EditPost/>} />
    </Route>
   </Routes>
    </UserContextProvider>
  );
}

export default App;
