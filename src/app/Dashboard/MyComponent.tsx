import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Text,
  TextContent,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';
import { PodcastIcon } from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React, { ChangeEvent, FormEvent } from 'react';
import { K8sApiUtils } from 'src/utils/K8sApiUtils';

class MyComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      jmeno: 'test',
      pods: [],
      isLoading: false,
      input: 'default',
    };
    this.buttonClicked = this.buttonClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value: string) {
    console.log(`value: ${value}`);
    this.setState({ input: value });
  }

  async buttonClicked() {
    this.setState({ isLoading: 'true', pods: [] });
    const k8sApiUtils = new K8sApiUtils('https://api.app.studio.adapters-crs-qe.com:6443', {
      Authorization: 'Bearer <PUT YOUR TOKEN HERE>',
    });
    const pods = await k8sApiUtils.getHelloWorlds(this.state.input);
    this.setState({ pods: pods.items });
    this.setState({ isLoading: false });
  }

  render() {
    const { input } = this.state;
    return (
      <div>
        <Form isHorizontal>
          <FormGroup label="Namespace" isRequired fieldId="input">
            <TextInput value={input} onChange={this.handleChange} />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" isLoading={this.state.isLoading} onClick={this.buttonClicked}>
              Submit
            </Button>
          </ActionGroup>
        </Form>
        <TextContent>
          <Text component={TextVariants.h1}>Result:</Text>
        </TextContent>
        <TableComposable>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Spec</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {this.state.pods.length > 0 &&
              this.state.pods.map((pod) => (
                <Tr key={pod.metadata.name}>
                  <Td>{pod.metadata.name}</Td>
                  <Td>
                    <pre>{JSON.stringify(pod.spec, null, 2)}</pre>
                  </Td>
                  <Td>
                    <pre>{JSON.stringify(pod.status, null, 2)}</pre>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </TableComposable>
      </div>
    );
  }
}

export default MyComponent;
