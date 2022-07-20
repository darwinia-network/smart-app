import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './config/i18n';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { AccountProvider, ApiProvider, AssetsProvider, GqlProvider } from './providers';
import './theme/antd/index.less';

const client = new GraphQLClient({
  url: 'http://localhost:3000/',
});

ReactDOM.render(
  <Suspense fallback='loading'>
    <Router>
      <ClientContext.Provider value={client}>
        <ApiProvider>
          <AccountProvider>
            <AssetsProvider>
              <GqlProvider>
                <App />
              </GqlProvider>
            </AssetsProvider>
          </AccountProvider>
        </ApiProvider>
      </ClientContext.Provider>
    </Router>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
