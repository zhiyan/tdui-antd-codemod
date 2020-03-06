import { Spin as TestLoading } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <TestLoading tip="加载中" spinning={false} size="large">
        <div style={{padding: 50, textAlign: 'center'}} text="aaa">loading Content</div>
      </TestLoading>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
