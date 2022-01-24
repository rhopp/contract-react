export default function getNewInstance(namespace: string, contract: string, waitTime: number) {
    return JSON.stringify({
            "apiVersion": "webapp.appstudio.qe/v1",
            "kind": "ContractTests",
            "metadata": {
                "name": contract,
                "namespace": namespace
            },
            "spec": {
                "contractName": contract,
                "waitSeconds": waitTime
            }
    })
    
}