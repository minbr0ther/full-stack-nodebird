import { Form, Input, Button } from 'antd';
import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { addPost } from '../reducers/post';

const FromWrapper = styled(Form)`
  margin: 10px 0 20px;
`;

const ButtonWrapper = styled(Button)`
  float: right;
`;

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput();

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    dispatch(addPost(text));
  }, [text]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return (
    <FromWrapper encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <ButtonWrapper type="primary" htmlType="submit">
          게시글 작성
        </ButtonWrapper>
        <div>
          {imagePaths.map((v) => (
            <div key={v} style={{ display: 'inline-block' }}>
              <img src={v} style={{ width: '200px' }} alt={v} />
              <div>
                <Button>제거</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FromWrapper>
  );
};

export default PostForm;
