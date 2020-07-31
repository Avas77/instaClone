import React, {useState, useEffect} from 'react';
import './posts.css';
import Avatar from '@material-ui/core/Avatar';
import nice from '../../assets/nice.png';
import {db} from '../../firebase';
import firebase from 'firebase';

function Posts({postId, user, imageURL, userName, caption}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        } 

        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            userName: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className = "posts">
            <div className = "posts__header">
                <Avatar className = "posts__avatar" src = {nice} alt = "Cool" />
                <h3>{userName}</h3>
            </div>
            <img src = {imageURL} className = "posts__image" />
            <p className = "posts__text">
                {caption}
            </p>
            
            <div className = "posts__comment">
                <p className = "comment">view comments</p><br></br>
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.userName}: </strong>{comment.text}
                        </p>
                    ))
                }
            </div>

            {user && (
                <form className = "posts__commentbox">
                <input className = "posts__input" placeholder = "Add a comment..."
                value = {comment} onChange = {(e) => setComment(e.target.value)}
                ></input>
                <button className = "posts__button" diabled = {!comment}
                onClick = {postComment}>
                    Post
                </button>
                </form>
            )}
        </div>
    )
}

export default Posts;
