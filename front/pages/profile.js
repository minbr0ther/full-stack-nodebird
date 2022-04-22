import axios from 'axios';
import Head from 'next/head';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from '../reducers/user';
import wrapper from '../store/configureStore';

const Profile = () => {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

// 이부분이 home보다 먼저 실행됨, 프론트 서버에서 실행됨
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // 서버 쪽으로 쿠키 보내주기
    const cookie = context.req ? context.req.headers.cookie : '';

    // 🚨 쿠키를 지웠다가 다시 넣어주는 과정
    // 이런 과정이 없으면 서버에서 로그인된 계정이 다 공유됨
    axios.defaults.headers.Cookie = '';
    // 서버일때랑 쿠키가 있을때
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      // 사용자 정보 불러오기
      type: LOAD_MY_INFO_REQUEST,
    });
    // END가 REQUEST -> SUCCESS 될때까지 기다려준다
    // nextReduxWrapper에 하라고 씌였어서 작성
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Profile;
