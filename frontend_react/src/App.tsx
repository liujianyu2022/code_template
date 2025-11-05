import React from 'react';
import Home from './pages/home/Home';
import { useSelector } from 'react-redux';
import { StoreType } from './store/store';
import { AppStateType } from './types/ReducerTypes';
import { Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons"

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const App: React.FC = () => {
  const { isLoading } = useSelector<StoreType, AppStateType>(store => store.appReducer)

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <Spin spinning={true} indicator={antIcon} tip="Loading..." >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-red-500">
              Welcome to React 18
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Built with TypeScript, Webpack, and TailwindCSS
            </p>
            <Home />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default App;