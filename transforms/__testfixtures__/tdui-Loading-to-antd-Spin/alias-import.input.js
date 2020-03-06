import { Loading as TestLoading } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <TestLoading text="加载中" loading={false} size="large">
        <div style={{padding: 50, textAlign: 'center'}} text="aaa">loading Content</div>
      </TestLoading>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
