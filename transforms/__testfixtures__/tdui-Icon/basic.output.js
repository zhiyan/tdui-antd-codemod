import { Icon } from 'td-icon';
import { Col, Row } from 'td-ui';

class App extends React.Component {

  render() {
    return (
      <Row>
        <Col>
          <Icon type="tupian" />
        </Col>
      </Row>
    );
  }
}
ReactDOM.render(
  <App />,
  mountNode,
);
