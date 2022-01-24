import React, { useContext, useState } from 'react';
import { Flex, FlexItem, Form, FormGroup, TextInput, FormHelperText, Grid, GridItem, PageSection, ActionGroup, Button, Alert, AlertActionCloseButton, AlertGroup, AlertVariant, getUniqueId } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import getNewInstance from 'src/utils/getjson';
import { K8sApiUtils } from 'src/utils/K8sApiUtils';
import { Context } from 'src/store/store';

const CreateCustomResource : React.FunctionComponent<never> = () => {
    type validateType = "error" | "default" | "success" | "warning" | undefined
const [validated0, setvalidated0]  = useState<validateType>("default")
const {state, dispatch} = useContext(Context)
const [validated1, setvalidated1]  = useState<validateType>("default")
const [validated2, setvalidated2]  = useState<validateType>("default")
const [Loading, setLoading] = useState(false);
const [value, setvalue] = useState('');
const [name, setName] = useState('');
const [waitTime, setWaitTime] = useState(10);
const handleTextInputChange = (value) => {
    setvalue(value)
}
const handleNameInputChange = (value) => {
    setName(value)
}
const handleWaitTimeChange = (value) => {
    setWaitTime(value);
}
const submitForm = () => {
    setLoading(true)
    if(value === ''|| name === '' || waitTime < 5){
        console.log("Cannot proceed!")
        setLoading(false)
    }
    else{
        const data = getNewInstance(value, name, waitTime);
        console.log(data);
        const k8sApiUtils = new K8sApiUtils('http://127.0.0.1:8001', {
      // Authorization: 'Bearer <token>',
    });
    k8sApiUtils.postCustomResource(data, value, name).then((resp)=>{
        if(resp.status === 201){
            
            const successAlert = {
                title: "["+ resp.status + "] Create Resource Instance Success!",
                details: resp.data.toString(),
                key: getUniqueId(),
                variant: "success"
            }
            dispatch({type: "ADD_Alert", data: successAlert});
            setLoading(false); 
            setName('');
            setvalue('');
            setWaitTime(10);
        }
        else{
            const errorAlert = {
                title: "["+ resp.status + "] Create Resource Instance!",
                details: resp.data.toString(),
                key: getUniqueId(),
                variant: "danger"
            }
            dispatch({type: "ADD_Alert", data: errorAlert});
            setLoading(false);
        }
    });
    


    }
}
return (
    <React.Fragment>
        
        <Grid hasGutter>
            <GridItem span={12}>
        <Form>
            <Flex direction={{ default: 'column' }}>
                <FlexItem>
        <FormGroup
          label="Name Space"
          type="text"
          helperText={
            <FormHelperText icon={<ExclamationCircleIcon />} isHidden={value !== ''}>
              Please enter Namespace under which you need to create the resource
            </FormHelperText>
          }
          required
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="namespace-1"
          validated={validated0}
        >
          <TextInput
            validated={validated0}
            value={value}
            id="namespace-1"
            aria-describedby="namespace-1-helper"
            onChange={handleTextInputChange}
          />
        </FormGroup>
        </FlexItem>
        <FlexItem>
        <FormGroup
          label="Contract Name"
          type="text"
          helperText={
            <FormHelperText icon={<ExclamationCircleIcon />} isHidden={name !== ''}>
              Please enter Contract Name
            </FormHelperText>
          }
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="name-1"
          required
          validated={validated1}
        >
          <TextInput
            validated={validated1}
            value={name}
            id="name-1"
            aria-describedby="name-1-helper"
            onChange={handleNameInputChange}
          />
        </FormGroup>
        </FlexItem>
        <FlexItem>
        <FormGroup
          label="Wait Time in seconds"
          type="number"
          required
          helperText={
            <FormHelperText icon={<ExclamationCircleIcon />} isHidden={waitTime > 5}>
              Please enter time more than 5 secs
            </FormHelperText>
          }
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          fieldId="time-1"
          validated={validated2}
        >
          <TextInput
            validated={validated2}
            value={waitTime}
            id="time-1"
            aria-describedby="time-1-helper"
            onChange={handleWaitTimeChange}
          />
        </FormGroup>
        </FlexItem>
        <FlexItem>
        <ActionGroup>
          <Button variant="primary" isLoading={Loading} onClick={submitForm}>Submit</Button>
          <Button variant="link">Cancel</Button>
        </ActionGroup>
        </FlexItem>
        </Flex>

      </Form>
      </GridItem>
      </Grid>
    </React.Fragment>
);
}

export default CreateCustomResource;