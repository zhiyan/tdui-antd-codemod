import { Spin } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <Spin tip="加载中" spinning={false} size="large">
        <div style={{padding: 50, textAlign: 'center'}} text="aaa">loading Content</div>
      </Spin>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
