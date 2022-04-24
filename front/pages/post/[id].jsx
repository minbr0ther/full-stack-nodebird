import axios from 'axios';
import Head from 'next/head';
import React from 'react';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/dist/client/router';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';

const Post = () => {
  const { singlePost } = useSelector((state) => state.post);
  const router = useRouter();
  const { id } = router.query;

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        {/* 제목 */}
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        {/* 설명 */}
        <meta property="og:description" content={singlePost.content} />
        {/* 썸네일 */}
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : 'http://localhost:3060/favicon.ico'
          }
        />
        {/* 링크 눌렀을때 가는 url */}
        <meta property="og:url" content={`http://localhost:3060/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// 이부분이 home보다 먼저 실행됨, 프론트 서버에서 실행됨
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id, // 현재 게시물의 id
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Post;
