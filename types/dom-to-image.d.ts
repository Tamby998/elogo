declare module "dom-to-image" {
  export function toPng(node: HTMLElement, options?: any): Promise<string>;
  export function toSvg(node: HTMLElement, options?: any): Promise<string>;
  export default {
    toPng,
    toSvg,
  };
}
