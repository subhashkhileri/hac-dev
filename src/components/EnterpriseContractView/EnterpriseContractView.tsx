import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Spinner,
  Text,
  TextContent,
  Title,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { EnterpriseContractPolicyGroupVersionKind } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { EnterpriseContractPolicyKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ENTERPRISE_CONTRACT_INFO_LINK, ENTERPRISE_CONTRACT_POLICIES_DATA } from './const';
import ReleasePolicyPackageItem from './ReleasePolicyPackageItem';
import { useEnterpriseContractPolicies } from './useEnterpriseContractPolicies';

import './EnterpriseContractView.scss';

const EnterpriseContractViewEmptyState: React.FC = () => (
  <EmptyState data-testid="enterprise-contract-view-empty-state" variant={EmptyStateVariant.lg}>
    <EmptyStateHeader
      titleText="No release policies"
      icon={<EmptyStateIcon icon={CubesIcon} />}
      headingLevel="h4"
    />
  </EmptyState>
);

const EnterpriseContractView: React.FC = () => {
  const { namespace } = useWorkspaceInfo();
  const [contractPolicies, loaded] = useEnterpriseContractPolicies(
    ENTERPRISE_CONTRACT_POLICIES_DATA,
  );

  const [enterpriseContractPolicy, policyLoaded] = useK8sWatchResource<
    EnterpriseContractPolicyKind[]
  >({
    groupVersionKind: EnterpriseContractPolicyGroupVersionKind,
    namespace,
    isList: true,
    limit: 1,
  });

  const releasePolicies = React.useMemo(
    () =>
      loaded && contractPolicies?.releasePackages
        ? Object.keys(contractPolicies.releasePackages)
        : [],
    [contractPolicies, loaded],
  );

  return (
    <>
      <Text data-testid="enterprise-contract-title" component="p" className="pf-v5-u-mt-lg">
        An Enterprise Contract (EC) is a set of release policies applied to your release target,
        also known as a managed environment.{' '}
        <ExternalLink href={ENTERPRISE_CONTRACT_INFO_LINK} text="Learn more" />
      </Text>
      <Title headingLevel="h3" className="pf-v5-u-mt-md pf-v5-u-mb-md">
        Release Policy
      </Title>
      <Text component="p" className=" pf-v5-u-mb-lg">
        These rules are applied to pipeline run attestations associated with container images build
        by HACBS. Follow these rules to be able to release successfully.
      </Text>
      {loaded ? (
        <>
          {releasePolicies.length ? (
            <>
              <TextContent className="enterprise-contract-view__package-titles">
                <Text component="h5" className="pf-v5-u-pl-lg pf-v5-u-m-0">
                  Rule
                </Text>
                <Text component="h5" className="pf-v5-u-m-0">
                  Description
                </Text>
              </TextContent>
              <div
                data-testid="enterprise-contract-package-list"
                className="enterprise-contract-view__package-list"
              >
                {contractPolicies?.releasePackages &&
                  releasePolicies.map((packageKey) => (
                    <ReleasePolicyPackageItem
                      key={packageKey}
                      releasePackageInfo={contractPolicies.releasePackages[packageKey]}
                      releasePackageAnnotations={contractPolicies.releaseAnnotations[packageKey]}
                    />
                  ))}
              </div>
            </>
          ) : (
            <EnterpriseContractViewEmptyState />
          )}
        </>
      ) : (
        <Bullseye className="pf-v5-u-mt-lg">
          <Spinner />
        </Bullseye>
      )}
      {policyLoaded && enterpriseContractPolicy[0]?.spec.sources[0]?.git?.repository ? (
        <div data-testid="enterprise-contract-github-link" className="pf-v5-u-mt-md">
          <ExternalLink href={enterpriseContractPolicy[0].spec.sources[0].git.repository} hideIcon>
            <Flex
              alignItems={{ default: 'alignItemsCenter' }}
              spaceItems={{ default: 'spaceItemsXs' }}
            >
              <FlexItem>View code on Github</FlexItem>
              <ArrowRightIcon />
            </Flex>
          </ExternalLink>
        </div>
      ) : null}
    </>
  );
};

export default EnterpriseContractView;
