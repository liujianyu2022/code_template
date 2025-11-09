import React from 'react';
import { useSelector } from 'react-redux';
import { StoreType } from './store/store';
import { AppStateType } from './types/ReducerTypes';
import { Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons"

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const App: React.FC = () => {
  const { isLoading } = useSelector<StoreType, AppStateType>(store => store.appReducer)
  const elements = useRoutes(routes)
  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <Spin spinning={isLoading} indicator={antIcon} tip="Loading..." >
        <div className="container mx-auto px-4 py-16">
          {
            elements
          }
        </div>
      </Spin>
    </div>
  );
};

export default App;