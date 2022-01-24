import { ButtonVariant, FormSelect, FormSelectOption, getUniqueId, Grid, GridItem } from '@patternfly/react-core';
import { TableComposable, Thead, Tr, Th, Tbody, Td, ActionsColumn, IAction } from '@patternfly/react-table';
import React, { useState, useEffect } from 'react';
import { Context } from 'src/store/store';
import { K8sApiUtils } from 'src/utils/K8sApiUtils';


interface itemsR {
    name: string;
    CRD: string;
    waitSeconds: number;
    message: string | null;
    status: string | null;
  }

const ViewCustomResource : React.FunctionComponent<never> = () => {
    const {state, dispatch} = React.useContext(Context)
    const [context, setContext] = useState('default')
    const k8sApiUtils = new K8sApiUtils('http://127.0.0.1:8001', {
      // Authorization: 'Bearer <token>',
    });
    useEffect(()=> {
        k8sApiUtils.getCustomResources(context).then((value)=> {
            dispatch({type: 'APIData', data: value['items']})
        })
      },[])
    const columnNames = {
        name: 'Instance Name',
        CRD: 'Custom Resource',
        waitSeconds: 'Wait Seconds',
        message: 'Message',
        status: 'Status',
        actions: 'Actions'
      };
    const onChange = (value) =>{
        setContext(value)
        getCoustomRs(value);
    }
    const getCoustomRs = (namespace: string)=> {
    k8sApiUtils.getCustomResources(namespace).then((value)=> {
        dispatch({type: 'APIData', data: value['items']})
    })
    }

  const customStyle = {
    borderLeft: '3px solid var(--pf-global--primary-color--100)'
  };
  const [OpenIndex, setOpenIndex] = useState(0);
  function handleRowClick(index , element){
    setOpenIndex(index);
    console.log(element);
  }

  function deleteCRs(name :string, namespace: string) {
    k8sApiUtils.deleteCustomResource(namespace, name).then((resp) => {
        const successAlert = {
            title: "["+ resp.status + "] Delete Instance Success!",
            details: resp.data.toString(),
            key: getUniqueId(),
            variant: "success"
        }
        dispatch({type: "ADD_Alert", data: successAlert});
        k8sApiUtils.getCustomResources(namespace).then((value)=> {
            dispatch({type: 'APIData', data: value['items']})
        })
    })
  }

  const defaultActions = (name: string, namespace): IAction[] => [
    {
      title: 'Delete',
      onClick: () =>  deleteCRs(name, namespace),
    }
  ];

return (
    <React.Fragment>
        <Grid hasGutter>
            <GridItem span={12}>
            <FormSelect value={context} onChange={onChange} aria-label="FormSelect Input">
            {state.namespaces.map((option, index) => (
            <FormSelectOption isDisabled={option['disabled']} key={index} value={option['value']} label={option['label']} />
            ))}
      </FormSelect>
            </GridItem>
            <GridItem>
            {state.APIData && (

            
            <TableComposable aria-label="Hoverable table">
            <Thead>
                <Tr>
                <Th>{columnNames.name}</Th>
                <Th>{columnNames.CRD}</Th>
                <Th>{columnNames.waitSeconds}</Th>
                <Th>{columnNames.status}</Th>
                <Th>{columnNames.message}</Th>
                <Th>{columnNames.actions}</Th>
                </Tr>
            </Thead>
            <Tbody>
               {  
                    state.APIData.map((item, index) => (
    
                        <Tr isHoverable key={index} style={OpenIndex === index ? customStyle : {}} onRowClick={(event)=>{handleRowClick(index, item)}}>
                            <Td dataLabel={columnNames.name}>{item['metadata'].name}</Td>
                            <Td dataLabel={columnNames.CRD}>{item.kind}</Td>
                            <Td dataLabel={columnNames.waitSeconds}>{item['spec'].waitSeconds}</Td>
                            {item['status'] ? (
                                <><Td dataLabel={columnNames.status}>{item['status'].status}</Td><Td dataLabel={columnNames.message}>{item['status'].message}</Td></>
                            ): (
                                <><Td dataLabel={columnNames.status}>{'...'}</Td><Td dataLabel={columnNames.message}>{'...'}</Td></>
                            )
                            }
                            <Td>
                  
                            <ActionsColumn
                            items={defaultActions(item['metadata'].name, item['metadata'].namespace)}
                            />
                            </Td>
                        </Tr>
        
                    )) 
                } 
            </Tbody>
            </TableComposable>
            )}
            </GridItem>
        </Grid>
    </React.Fragment>
);
}

export default ViewCustomResource;


