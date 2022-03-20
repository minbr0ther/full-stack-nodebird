import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Input, Menu, Row, Col } from 'antd';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import styled from 'styled-components';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      {/* gutter 컬럼간의 간격 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/* target="_blank" 새창에서 띄우기 */}
          <a
            href="https://linktr.ee/minbr0ther"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by minbr0ther
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  // react의 node
  children: PropTypes.node.isRequired,
};

export default AppLayout;
