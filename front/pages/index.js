import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) alert(retweetError);
  }, [retweetError]);

  useEffect(() => {
    const onScroll = () => {
      if (
        // 맨마지막 부터 +300 px 안에 스크롤이 위치하면
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        // 이미 추가로 로딩을 하고 있을때는 무시한다
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          console.log(lastId);
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// 이부분이 home보다 먼저 실행됨
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    context.store.dispatch({
      // 사용자 정보 불러오기
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      // 게시물 정보 불러오기
      type: LOAD_POSTS_REQUEST,
    });
    // END가 REQUEST -> SUCCESS 될때까지 기다려준다
    // nextReduxWrapper에 하라고 씌였어서 작성
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Home;
