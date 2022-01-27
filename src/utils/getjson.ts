export default function getNewInstance(namespace: string, contract: string, waitTime: number) {
  return JSON.stringify(getNewInstanceAsObject(namespace, contract, waitTime));
}
export function getNewInstanceAsObject(namespace: string, contract: string, waitTime: number) {
  return {
    apiVersion: 'webapp.appstudio.qe/v1',
    kind: 'ContractTests',
    metadata: {
      name: contract,
      namespace: namespace,
    },
    spec: {
      contractName: contract,
      waitSeconds: waitTime,
    },
  };
}
