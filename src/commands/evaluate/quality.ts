import { get } from "lodash";
import semver from "semver";
import url from "url";
import { PackageCollected } from "npms-io-client";
import { normalizeValue } from "./utils";

export function carefulness(collected: PackageCollected) {
  const readmeEvaluation = normalizeValue(get(collected, 'source.files.readmeSize', 0), [
      { value: 0, norm: 0 },
      { value: 400, norm: 1 },
  ]);
  return {
    licenseEvaluation: Number(Boolean(collected.metadata.license)),
    readmeEvaluation,
    lintersEvaluation: Number(!!get(collected, 'source.linters', null)),
    ignoreEvaluation: Number(get(collected, 'source.files.hasNpmIgnore') || collected.metadata.hasSelectiveFiles || false),
    changelogEvaluation: Number(get(collected, 'source.files.hasChangelog', false)),
    isDeprecated: Number(!Boolean(collected.metadata.deprecated)),
    isStable: Number(semver.gte(collected.metadata.version, '1.0.0', true))
  }
}

export function tests(collected: PackageCollected) {
  if(!collected.source) {
    return {
      testsEvaluation: 0,
      coverageEvaluation: 0,
      statusEvaluation: 0
    }
  }
  const testsEvaluation = normalizeValue(collected.source.files.testsSize, [
    { value: 0, norm: 0 },
    { value: 400, norm: collected.metadata.hasTestScript ? 1 : 0.5 },
  ]);
  const coverageEvaluation = collected.source.coverage || 0;
  const statusEvaluation = ((collected.github && collected.github.statuses) || []).reduce((sum, status, _index, arr) => {
    switch (status.state) {
      case 'success':
        return sum + (1 / arr.length);
      case 'pending':
        return sum + (0.3 / arr.length);
      case 'error':
      case 'failure':
        return sum;
      default:
        return sum;
    }
  }, 0);
  return {
    testsEvaluation,
    statusEvaluation,
    coverageEvaluation
  }
}

export function health(collected: PackageCollected) {
  if (!collected.source) {
    return {
      outdatedEvaluation: 0,
      vulnerabilitiesEvaluation: 0,
      unlockedEvaluation: 0
    }
  }
  const dependencies = collected.metadata.dependencies || {};
  const dependenciesCount = Object.keys(dependencies).length;
  if(!dependenciesCount) {
    return {
      outdatedEvaluation: 1,
      vulnerabilitiesEvaluation: 1,
      unlockedEvaluation: 1
    }
  }

  // Calculate outdated count
  const outdatedCount = collected.source.outdatedDependencies ?
    Object.keys(collected.source.outdatedDependencies).length :
    (collected.source.outdatedDependencies ? dependenciesCount : 0);

  // Calculate vulnerabilities count
  const vulnerabilitiesCount = Array.isArray(collected.source.vulnerabilities) ?
    collected.source.vulnerabilities.length :
    (collected.source.vulnerabilities ? dependenciesCount : 0);

  // Calculate unlocked count - packages that have loose locking of versions, e.g.: '*' or >= 1.6.0
  // Note that if the package has npm-shrinkwrap.json, then it actually has its versions locked down
  const unlockedCount = collected.source.files.hasShrinkwrap ? 0 :
    Object.keys(dependencies).reduce((count, key) => {
      const value = dependencies[key];
      const range = semver.validRange(value, true);
      return range && !semver.gtr('1000000.0.0', range, true) ? count + 1 : count;
    }, 0);

  const outdatedEvaluation = normalizeValue(outdatedCount, [
    { value: 0, norm: 1 },
    { value: Math.max(2, dependenciesCount / 4), norm: 0 },
  ]);
  const vulnerabilitiesEvaluation = normalizeValue(vulnerabilitiesCount, [
    { value: 0, norm: 1 },
    { value: Math.max(2, dependenciesCount / 4), norm: 0 },
  ]);

  const finalWeightConditioning = !unlockedCount ? 1 : 1 / (unlockedCount + 1);

  return {
    outdatedEvaluation,
    vulnerabilitiesEvaluation,
    unlockedEvaluation: finalWeightConditioning
  }
}

export function branding(collected: PackageCollected) {
  const parsedRepository = url.parse(get(collected.metadata, 'repository.url', ''));
  const parsedHomepage = url.parse(get(collected.metadata, 'links.homepage', get(collected, 'github.homepage', '')));
  const hasCustomHomepage = Boolean(parsedRepository.host && parsedHomepage.host && parsedRepository.host !== parsedHomepage.host);
  const badgesCount = get(collected, 'source.badges.length', 0);
  const badgesEvaluation = normalizeValue(badgesCount, [
      { value: 0, norm: 0 },
      { value: 4, norm: 1 },
  ]);
  return {
    homepageEvaluation: Number(hasCustomHomepage),
    badgesEvaluation
  }
}
