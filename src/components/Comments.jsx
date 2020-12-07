import React from "react";
import {Comment} from "./Comment";


export const Comments = ({comments}) => {
    return (
        <div>
            {comments.map(comment => <Comment comment={comment}/>)}
        </div>
    )
}
