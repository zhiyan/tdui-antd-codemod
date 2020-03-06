import { Loading } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <Loading text="加载中" loading={false} size="large">
        <div style={{padding: 50, textAlign: 'center'}} text="aaa">loading Content</div>
      </Loading>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
