declare module "semver" {
  const semver: {
    gte: (a: string, b: string, c: boolean) => boolean;
    gtr: (a: string, b: unknown, c: boolean) => boolean;
    validRange: (a: string, b: boolean) => unknown;
  };
  export default semver;
}

declare module "url" {
  const url: {
    parse: (a: string) => {
      host: string;
    };
  };
  export default url;
}
