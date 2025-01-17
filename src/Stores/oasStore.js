import {hasIn, escapeRegExp} from 'lodash';
import {toFSPath, resolve, isURL} from '@stoplight/path';
import Path from './oas/path';
import Service from './oas/service';
import {eventTypes, nodeOperations} from '../datasets/tree';

class OasStore {
  constructor(e) {
    this.stores = e;
    this.path = new Path(e);
    this.service = new Service(e);
    this.eventEmitter = e.eventEmitter;
    //this.operation = new ld(e)
    //this.service = new hd(e)
  }

  activate() {
    this.path.activate();
    this.service.activate();
  }

  registerEventListeners() {
    this.eventEmitter.on(eventTypes.GoToRef, (refPath) => {
      const sourceNode = this.stores.uiStore.activeSourceNode;
      if (!sourceNode || !refPath) {
        return;
      }

      if (isURL(refPath)) {
        this.stores.browserStore.openUrlInBrowser(refPath);
        return;
      }
      let nodeUri;
      let resolvedRefPath = toFSPath(
        resolve(
          sourceNode.uri.replace(
            new RegExp(escapeRegExp(sourceNode.path) + '$'),
            '',
          ),
          refPath,
        ),
      );

      const hashLoc = resolvedRefPath.indexOf('#');

      if (hashLoc !== -1) {
        nodeUri =
          resolvedRefPath.length < hashLoc + 2
            ? undefined
            : resolvedRefPath.slice(hashLoc + 1);
      }

      const node = this.stores.graphStore.getNodeByUri(
        `/p/reference.yaml${nodeUri}`,
      );
      if (node) {
        this.stores.uiStore.setActiveNode(node);
      }
    });
  }

  addSharedParameter({sourceNodeId, name, parameterType}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'parameters'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            name,
            in: parameterType,
            required: parameterType === 'path',

            schema: {
              type: 'string',
            },
          },
        },
      ],
    );
  }

  addSharedResponse({sourceNodeId, name}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'responses'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            description: '',

            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      ],
    );
  }

  addSharedExample({sourceNodeId, name}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'examples'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            description: 'Example shared example',
            type: 'object',

            properties: {
              id: {
                type: 'string',
              },
            },

            required: ['id'],
          },
        },
      ],
    );
  }

  addSharedRequestBody({sourceNodeId, name}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'requestBodies'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            description: 'Example response',

            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      ],
    );
  }
}

export default OasStore;
