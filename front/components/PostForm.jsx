import { Form, Input, Button } from 'antd';
import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import {
  ADD_POST_REQUEST,
  REMOVE_IMAGE,
  UPLOAD_IMAGES_REQUEST,
} from '../reducers/post';

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
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }

    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', text);

    return dispatch({ type: ADD_POST_REQUEST, data: formData });
  }, [text, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);

    // formData를 사용하면 multipart로 서버 전송 가능
    // multipart로 보내야 Multer가 처리한다
    const imageFormData = new FormData();

    // e.target.files가 배열이 아니끼 때문에
    // 안에 forEach가 없기 때문에, call을 통해서 빌려쓴다?
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });

    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    [],
  );

  return (
    <FromWrapper encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <ButtonWrapper type="primary" htmlType="submit">
          게시글 작성
        </ButtonWrapper>
        <div>
          {imagePaths.map((v, i) => (
            <div key={v} style={{ display: 'inline-block' }}>
              {/* 프론트 서버 주소에서 백 주소로 변경! */}
              <img
                src={`http://localhost:3065/${v}`}
                style={{ width: '200px' }}
                alt={v}
              />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FromWrapper>
  );
};

export default PostForm;
