import React, {useState, useEffect} from 'react';
import './App.css';
import logo from './assets/logo.png';
import Posts from './components/posts/posts';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: '20px'
    },
}));
  

function App(){
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [login, setLogin] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if(authUser){
                console.log(authUser);
                setUser(authUser);
            }
            else{
                setUser(null);
            }
        })
    }, [user, userName]);

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, []);

    const signUp = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: userName,
            })
        })
        .catch(err => alert(err.message));
        setOpen(false);
    }
    
    const openLogin = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .catch(err => alert(err.message))
        setLogin(false);
    }

    return(
        <div className = "app">
            <Modal
            open={open}
            onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className = "app__signup">
                        <center>
                            <img src = {logo} className = "app__headerImage" />
                        </center>
                        <Input type = "text" 
                        onChange = {(e) => setuserName(e.target.value)}
                        value = {userName}
                        placeholder = "Username ..."></Input>
                        <Input type = "text"
                        onChange = {(e) => setEmail(e.target.value)}
                        value = {email}
                        placeholder = "Email ..."></Input>
                        <Input type = "password"
                        onChange = {(e) => setPassword(e.target.value)}
                        value = {password}
                        placeholder = "Password ..."></Input>
                        <Button onClick = {signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>    

            <Modal
            open={login}
            onClose={() => setLogin(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className = "app__signup">
                        <center>
                            <img src = {logo} className = "app__headerImage" />
                        </center>
                        <Input type = "text"
                        onChange = {(e) => setEmail(e.target.value)}
                        value = {email}
                        placeholder = "Email ..."></Input>
                        <Input type = "password"
                        onChange = {(e) => setPassword(e.target.value)}
                        value = {password}
                        placeholder = "Password ..."></Input>
                        <Button onClick = {openLogin}>Log in</Button>
                    </form>
                </div>
            </Modal> 

            <div className = "app__header">
                <img src = {logo} className = "app__headerImage" />
                <h4 className = "free">Express</h4>
                {user ? (
                    <button className = "btn" onClick = {() => auth.signOut()}>Logout</button>
                ) : (
                    <div className = "app__loginContainer">
                        <button className = "btn" onClick = {() => setLogin(true)}>
                            <strong>Log in</strong></button>
                        <button className = "btn" onClick = {() => setOpen(true)}>
                            <strong>Sign Up</strong></button>
                    </div>
                )}
            </div>

            <div className = "app__posts">
                <div className = "app_postsleft">
                    {
                        posts.map(({post, id}) => {
                            return <Posts key = {id} user = {user} postId = {id} 
                            userName = {post.userName} caption = {post.caption} 
                            imageURL = {post.imageURL} />
                        })
                    }
                </div>
                <div className = "app__postsright">
                    <InstagramEmbed
                    url='https://www.instagram.com/p/BwZVm4CDTNl/'
                    maxWidth={320}
                    hideCaption={false}
                    containerTagName='div'
                    protocol=''
                    injectScript
                    onLoading={() => {}}
                    onSuccess={() => {}}
                    onAfterRender={() => {}}
                    onFailure={() => {}}
                    />
                </div>
            </div>

            {user?.displayName ? (
                <ImageUpload username = {user.displayName} />
            ) : (<h3 className = "info">You need to login to be able to upload.</h3>)}
        </div>
    )
}

export default App;


