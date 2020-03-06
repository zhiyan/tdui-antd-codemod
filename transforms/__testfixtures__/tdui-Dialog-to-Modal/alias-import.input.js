import { Col, Dialog as TestModal, Row } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <Row>
        <Col onClick={() => {
          TestModal.confirm({
            title: '确认停用该报警模版吗?',
            closable: true,
            Dialog: 1,
            onOk: () => {
              remove(id).then(success => {
                if (success) {
                  message.success('停用成功！');
                  getList();
                }
              });
            },
          });
        }}>123</Col>
        <TestModal title="test" />
      </Row>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
