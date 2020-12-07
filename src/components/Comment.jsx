import React from "react";
import {Avatar, Comment as AntComment} from "antd";
import {useDispatch} from "react-redux";
import {getCommentKidsAsync} from "../redux/newsSlice";
import {Comments} from "./Comments";


export const Comment = ({comment}) => {
    const dispatch = useDispatch();
    const [clicked, setClicked] = React.useState(false);
    const handleShowCommentKids = (kids)=> {
         setClicked(true);
        if (isFinite(kids[0])) {
            dispatch(getCommentKidsAsync(kids))
        }
    }
    if (comment.delete) return <p>Комментарий был удален</p>
    return (
        <AntComment key={comment.id}
                 actions={[<span
                     key="comment-nested-reply-to">Reply to</span>]}
                 author={<span>{comment.by}</span>}
                 avatar={
                     <Avatar
                         src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                         alt="Han Solo"
                     />
                 }
                 content={comment.text}
                 className={comment.kids && 'pointer'}
                 onClick = {()=>comment.kids && handleShowCommentKids(comment.kids)}
        >
            {comment.kids && clicked && <Comments comments={comment.kids}/>}
        </AntComment>
    )

}
