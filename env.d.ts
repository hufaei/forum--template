declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module 'vue-navigation-bar'
declare module 'goeasy'
declare module '*.png' {
    const value: string;
    export default value;
  }