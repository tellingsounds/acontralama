/**
 * Make the TS compiler play nice with importing markdown files.
 */
declare module '*.md' {
  const markdown: string;
  export default markdown;
}
