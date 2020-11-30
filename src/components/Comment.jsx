import React from "react";
import {Avatar, Comment} from "antd";
import {useDispatch} from "react-redux";
import {getCommentsListAsync} from "../features/redux/newsSlice";


export const CommentElem = ({comments}) => {
    const dispatch = useDispatch();
    const showKidsComments = (kids)=> {
        if (kids) {
            dispatch(getCommentsListAsync(kids))
        }
        else return;
    }


        let commentsElems = comments.map(comment => <Comment key={comment.id}
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
                                                             onClick = {()=>comment.kids && showKidsComments(comment.kids)}

        >
        </Comment>)
        return (
            <div>
                {commentsElems}
            </div>
        )

}
