import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import React, { Suspense } from 'react';
import reportWebVitals from './reportWebVitals';
import './index.css';

const Announcement = React.lazy(() => import('./pages/Announcement'));

ReactDOM.render(
  <Suspense
    fallback={
      <div className='w-screen h-screen flex justify-center items-center'>
        <Spin size='large' />
      </div>
    }
  >
    <Announcement />
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
