/// <reference types="next" />

// Declaración de tipos para imports de CSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
