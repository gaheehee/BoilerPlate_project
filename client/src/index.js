import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { provider} from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

// 원래는 store를 redux에서 생성하면 되지만, 그냥 store는 객체밖에 못 받기 때문에 promise와 function도 받을 수 있게 middleware와 함께 생성
const createStoreWithMiddleware = applyMiddleware( promiseMiddleware, ReduxThunk )(createStore)

ReactDOM.render(
  <provider 
    store = {createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()     // REDUX EXTENSION과 내 애플리케이션 연결
      )}
  >
    <App />
  </provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
