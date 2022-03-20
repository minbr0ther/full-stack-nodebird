import { createWrapper } from 'next-redux-wrapper';
import { compose, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from '../pages/reducers';

const configureStore = () => {
  const middlewares = [];
  const enhancer = // 리덕스의 기능의 확장
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares)) // 배포용
      : composeWithDevTools(applyMiddleware(...middlewares)); // 개발용
  const store = createStore(reducer, enhancer);

  return store;
};

// 두번째 객체 파라미터는 옵션이다.
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
