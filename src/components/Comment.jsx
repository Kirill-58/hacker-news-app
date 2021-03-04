import React from 'react';
import {Avatar, Comment as AntComment} from 'antd';
import {useDispatch} from 'react-redux';
import {getCommentKidsAsync} from '../redux/newsSlice';
import {Comments} from './Comments';
import {CaretDownOutlined} from '@ant-design/icons';


export const Comment = ({comment}) => {
  const dispatch = useDispatch();
  const [clicked, setClicked] = React.useState(false);
  const handleShowCommentKids = (kids)=> {
    setClicked(true);
    if (isFinite(kids[0])) {
      dispatch(getCommentKidsAsync(kids));
    }
  };
  // выполняем проверку на удаление и на наличие ответов
  const contentCreator = (comment) => {
    if (comment.deleted) {
      return <p>Комментарий был удален</p>;
    }
    // если есть ответы, добавляем иконку
    return <>
      <span>{comment.text}</span>{comment.kids && <CaretDownOutlined/>}
    </>;
  };
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
      content={contentCreator(comment)}
      className={comment.kids && 'have-children'}
      onClick = {()=>comment.kids && handleShowCommentKids(comment.kids)}
    >
      {comment.kids && clicked && <Comments comments={comment.kids}/>}
    </AntComment>
  );
};
