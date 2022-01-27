import { Interaction, InteractionObject, Pact } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { like, term } from '@pact-foundation/pact/src/dsl/matchers';
import { pactWith } from 'jest-pact';
import getNewInstance, { getNewInstanceAsObject } from './getjson';
import { K8sApiUtils } from './K8sApiUtils';

pactWith({ consumer: 'ContractsController', provider: 'MyProvider' }, (provider) => {
  jest.setTimeout(10000);
  let client: K8sApiUtils;
  beforeEach(() => {
    process.env.K8S_API_URL = provider.mockService.baseUrl;
    client = new K8sApiUtils();
  });
  const namespace: string = 'default';
  const name: string = 'testname';
  const waitTime: number = 5;

  describe('createContractTest', () => {
    beforeEach(() => {
      const interaction: InteractionObject = {
        state: undefined,
        uponReceiving: 'Request to create new ContractTest',
        withRequest: {
          method: HTTPMethod.POST,
          path: `/apis/webapp.appstudio.qe/v1/namespaces/${namespace}/contracttests`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: getNewInstanceAsObject(namespace, name, waitTime),
        },
        willRespondWith: {
          status: 201,
          body: {
            apiVersion: 'webapp.appstudio.qe/v1',
            kind: 'ContractTests',
            metadata: {
              creationTimestamp: term({
                generate: '2022-01-21T13:36:30Z',
                matcher:
                  '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$',
              }),
              generation: like(1),
              name: name,
              namespace: namespace,
            },
            spec: {
              contractName: name,
              waitSeconds: waitTime,
            },
          },
        },
      };
      provider.addInteraction(interaction);
    });

    it('successfully creates ContractTest CR on cluster', async () => {
      await client.postCustomResource(getNewInstance(namespace, name, waitTime), namespace);
    });
  });

  describe('getContractTests', () => {
    const namespace: string = 'default';
    beforeEach(() => {
      provider.addInteraction({
        state: 'contract test is already creted & reconciled',
        uponReceiving: 'A request for contracttests',
        withRequest: {
          method: 'GET',
          path: `/apis/webapp.appstudio.qe/v1/namespaces/${namespace}/contracttests`,
        },
        willRespondWith: {
          status: 200,
          body: {
            apiVersion: 'webapp.appstudio.qe/v1',
            items: [
              {
                apiVersion: 'webapp.appstudio.qe/v1',
                kind: 'ContractTests',
                metadata: {
                  name: name,
                  namespace: namespace,
                },
                spec: { contractName: name, waitSeconds: waitTime },
                status: {
                  message: `Hello ${name}`,
                  status: 'Active',
                  updatedAt: term({
                    generate: '2022-01-18 07:48:47.485620021 +0100 CET m=+7.106460549',
                    matcher: '.*',
                  }),
                },
              },
            ],
            kind: 'ContractTestsList',
          },
        },
      });
    });
    it('returns contracttests', async () => {
      await client.getCustomResources(namespace).then((contracts) => {
        expect(contracts.items[0].metadata.name).toEqual(name);
        expect(contracts.items[0].status.message).toEqual(`Hello ${contracts.items[0].spec.contractName}`);
      });
    });
  });
});
