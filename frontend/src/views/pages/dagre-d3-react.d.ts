import DagreGraph from 'dagre-d3-react';

declare module 'dagre-d3-react' {
  export type labelType = 'html' | 'svg' | 'string';
  export type d3Node = {
      id: any;
      label: string;
      class?: string;
      labelType?: labelType;
      config?: object;
  };
  export type d3Link = {
      source: string;
      target: string;
      class?: string;
      label?: string;
      config?: object;
  };
  // export default DagreGraph;
}