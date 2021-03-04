import React from 'react';
import {Comment} from './Comment';


export const Comments = ({comments}) => {
  return (
    <>
      {comments.map((comment) => <Comment comment={comment}
        key={comment.id ?? comment} />)}
    </>
  );
};
