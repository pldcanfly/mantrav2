import { NamespaceConfig } from '../classes/wsnamespace';
import { RaidNamespace } from '../wsnamespaces/raid';

export const namespaces: Array<NamespaceConfig> = [
  {
    name: 'raid',
    handler: RaidNamespace,
    events: ['updatestate'],
  },
];
