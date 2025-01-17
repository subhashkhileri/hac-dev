import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { ImportSecret } from '../components/ImportForm/utils/types';

export const SecretByUILabel = 'ui.appstudio.redhat.com/secret-for';

export enum SecretFor {
  deployment = 'Deployment',
  build = 'Build',
}

export type SecretKind = K8sResourceCommon & {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
};

type linkServiceAccount = {
  serviceAccount: {
    as?: 'secret' | 'imagePullSecret';
    managed?: {
      generateName?: string;
      name?: string;
    };
    reference: {
      name: string;
    };
  };
};

export type RemoteSecretKind = K8sResourceCommon & {
  spec: {
    secret: {
      linkedTo?: linkServiceAccount[];
      name: string;
      type: string;
      labels?: {
        [key: string]: string;
      };
      annotations?: {
        [key: string]: string;
      };
    };
    targets: { namespace: string }[];
  };
  status?: RemoteSecretStatus;
};

export interface RemoteSecretStatus {
  conditions?: SecretCondition[];
  secret?: Secret;
  targets?: Target[];
}

export enum RemoteSecretStatusReason {
  AwaitingData = 'AwaitingData',
  DataFound = 'DataFound',
  Injected = 'Injected',
  PartiallyInjected = 'PartiallyInjected',
  Error = 'Error',
  Unknown = '-',
}

export enum RemoteSecretStatusType {
  Deployed = 'Deployed',
  DataObtained = 'DataObtained',
}
export interface SecretCondition {
  lastTransitionTime: string;
  message: string;
  reason: RemoteSecretStatusReason | string;
  status: string;
  type: RemoteSecretStatusType | string;
}

export interface Secret {
  keys?: string[];
}

export interface Target {
  namespace: string;
  secretName: string;
}

export type SecretFormValues = ImportSecret & {
  existingSecrets?: string[];
};

export enum SecretTypeDropdownLabel {
  opaque = 'Key/value secret',
  image = 'Image pull secret',
}

export enum SecretType {
  opaque = 'Opaque',
  dockerconfigjson = 'kubernetes.io/dockerconfigjson',
  basicAuth = 'kubernetes.io/basic-auth',
  dockercfg = 'kubernetes.io/dockercfg',
  serviceAccountToken = 'kubernetes.io/service-account-token',
  sshAuth = 'kubernetes.io/ssh-auth',
  tls = 'kubernetes.io/tls',
}

export enum SecretTypeAbstraction {
  generic = 'generic',
  source = 'source',
  image = 'image',
}

export enum SecretTypeDisplayLabel {
  imagePull = 'Image pull',
  keyValue = 'Key/value',
}

export const K8sSecretType = {
  [SecretTypeDropdownLabel.opaque]: 'Opaque',
  [SecretTypeDropdownLabel.image]: 'kubernetes.io/dockerconfigjson',
};
