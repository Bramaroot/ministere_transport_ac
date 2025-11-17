declare module 'express-validator' {
  export function body(...args: any[]): any;
  export function validationResult(...args: any[]): any;
  export function param(...args: any[]): any;
  export function query(...args: any[]): any;
  export function check(...args: any[]): any;
}
