import { Spin as Loading } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <Loading tip="加载中" spinning={false} size="large">
        <div style={{padding: 50, textAlign: 'center'}} text="aaa">loading Content</div>
      </Loading>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
