// Ambient shims for the Figma Make export.
// npm packages aren't installed locally (Windows npm install fails on the
// version-suffixed aliases like "sonner"). Vite/esbuild strips types
// at build time, so these declarations only exist to keep the IDE quiet.

declare module "react" {
  export type ReactNode = any;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type Key = string | number;
  export type CSSProperties = any;
  export type FC<P = any> = (props: P) => any;
  export type FunctionComponent<P = any> = FC<P>;
  export type ComponentType<P = any> = FC<P>;
  export type ComponentProps<T = any> = any;
  export type PropsWithChildren<P = any> = P & { children?: any };
  export type Ref<T = any> = any;
  export type RefObject<T = any> = { readonly current: T | null };
  export type MutableRefObject<T = any> = { current: T };
  export type ForwardedRef<T = any> = any;
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export type EffectCallback = () => void | (() => void);
  export type DependencyList = ReadonlyArray<any>;

  export type SyntheticEvent<T = any, E = any> = any;
  export type ChangeEvent<T = any> = any;
  export type MouseEvent<T = any, E = any> = any;
  export type KeyboardEvent<T = any> = any;
  export type FormEvent<T = any> = any;
  export type FocusEvent<T = any> = any;
  export type DragEvent<T = any> = any;
  export type PointerEvent<T = any> = any;
  export type ClipboardEvent<T = any> = any;
  export type WheelEvent<T = any> = any;
  export type TouchEvent<T = any> = any;

  export type HTMLAttributes<T = any> = any;
  export type ButtonHTMLAttributes<T = any> = any;
  export type InputHTMLAttributes<T = any> = any;
  export type TextareaHTMLAttributes<T = any> = any;
  export type ImgHTMLAttributes<T = any> = any;
  export type AnchorHTMLAttributes<T = any> = any;
  export type LabelHTMLAttributes<T = any> = any;
  export type SelectHTMLAttributes<T = any> = any;
  export type DetailedHTMLProps<E = any, T = any> = any;
  export type ElementRef<T = any> = any;
  export type ComponentPropsWithoutRef<T = any> = any;
  export type ComponentPropsWithRef<T = any> = any;
  export type HTMLProps<T = any> = any;

  export function useState<S = any>(
    initial?: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  export function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
  export function useRef<T = any>(initial?: T | null): MutableRefObject<T>;
  export function useMemo<T = any>(factory: () => T, deps?: DependencyList): T;
  export function useCallback<T = any>(callback: T, deps?: DependencyList): T;
  export function useContext<T = any>(context: any): T;
  export function useReducer<S = any, A = any>(
    reducer: (state: S, action: A) => S,
    initial: S,
    init?: any
  ): [S, Dispatch<A>];
  export function useImperativeHandle<T = any>(
    ref: any,
    factory: () => T,
    deps?: DependencyList
  ): void;
  export function useDebugValue<T = any>(value: T, format?: (value: T) => any): void;
  export function useTransition(): [boolean, (cb: () => void) => void];
  export function useDeferredValue<T = any>(value: T): T;
  export function useId(): string;
  export function useSyncExternalStore<T = any>(
    subscribe: (cb: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T
  ): T;

  export function createContext<T = any>(defaultValue: T): any;
  export function forwardRef<T = any, P = any>(render: (props: P, ref: any) => any): any;
  export function memo<T = any>(component: T, propsAreEqual?: any): T;
  export function createElement(...args: any[]): any;
  export function cloneElement(element: any, props?: any, ...children: any[]): any;
  export function isValidElement(object: any): boolean;
  export function lazy<T = any>(factory: () => Promise<{ default: T }>): T;
  export function startTransition(cb: () => void): void;

  export const Children: any;
  export const Fragment: any;
  export const StrictMode: any;
  export const Suspense: any;
  export const Profiler: any;

  const React: any;
  export default React;
}

declare namespace React {
  type ReactNode = any;
  type ReactElement = any;
  type Key = string | number;
  type CSSProperties = any;
  type FC<P = any> = (props: P) => any;
  type FunctionComponent<P = any> = FC<P>;
  type ComponentType<P = any> = FC<P>;
  type ComponentProps<T = any> = any;
  type ComponentPropsWithoutRef<T = any> = any;
  type ComponentPropsWithRef<T = any> = any;
  type ElementRef<T = any> = any;
  type PropsWithChildren<P = any> = P & { children?: any };
  type Ref<T = any> = any;
  type RefObject<T = any> = { readonly current: T | null };
  type MutableRefObject<T = any> = { current: T };
  type ForwardedRef<T = any> = any;
  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prev: S) => S);
  type SyntheticEvent<T = any, E = any> = any;
  type ChangeEvent<T = any> = any;
  type MouseEvent<T = any, E = any> = any;
  type KeyboardEvent<T = any> = any;
  type FormEvent<T = any> = any;
  type FocusEvent<T = any> = any;
  type DragEvent<T = any> = any;
  type PointerEvent<T = any> = any;
  type ClipboardEvent<T = any> = any;
  type WheelEvent<T = any> = any;
  type TouchEvent<T = any> = any;
  type HTMLAttributes<T = any> = any;
  type ButtonHTMLAttributes<T = any> = any;
  type InputHTMLAttributes<T = any> = any;
  type TextareaHTMLAttributes<T = any> = any;
  type ImgHTMLAttributes<T = any> = any;
  type AnchorHTMLAttributes<T = any> = any;
  type LabelHTMLAttributes<T = any> = any;
  type SelectHTMLAttributes<T = any> = any;
  type DetailedHTMLProps<E = any, T = any> = any;
  type HTMLProps<T = any> = any;
}

declare module "react-dom" {
  const x: any;
  export default x;
  export function createPortal(node: any, container: any, key?: any): any;
  export function findDOMNode(instance: any): any;
  export function unmountComponentAtNode(container: any): boolean;
  export function flushSync<R = any>(fn: () => R): R;
}

declare module "react-dom/client" {
  export function createRoot(container: any, options?: any): {
    render(node: any): void;
    unmount(): void;
  };
  export function hydrateRoot(container: any, node: any, options?: any): any;
}

declare module "react/jsx-runtime" {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare module "react/jsx-dev-runtime" {
  export const Fragment: any;
  export function jsxDEV(
    type: any,
    props: any,
    key?: any,
    isStatic?: any,
    source?: any,
    self?: any
  ): any;
}

declare namespace NodeJS {
  type Timeout = any;
  type Timer = any;
  type Immediate = any;
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

// Figma Make imports libraries with a version suffix (e.g.
// "class-variance-authority"). The wildcard below covers value imports,
// but "namespace-as-type" errors happen when a *named* import is used as a
// type. Explicit shims for those specific libraries fix that.
declare module "class-variance-authority" {
  export type VariantProps<T = any> = any;
  export type ClassValue = any;
  export function cva(...args: any[]): any;
  const _default: any;
  export default _default;
}
declare module "class-variance-authority" {
  export type VariantProps<T = any> = any;
  export type ClassValue = any;
  export function cva(...args: any[]): any;
  const _default: any;
  export default _default;
}
declare module "clsx" {
  export type ClassValue = any;
  export function clsx(...inputs: any[]): string;
  export default function clsxDefault(...inputs: any[]): string;
}
declare module "clsx" {
  export type ClassValue = any;
  export function clsx(...inputs: any[]): string;
  export default function clsxDefault(...inputs: any[]): string;
}
declare module "sonner" {
  export type ToasterProps = any;
  export const Toaster: any;
  export const toast: any;
  const _default: any;
  export default _default;
}
declare module "sonner" {
  export type ToasterProps = any;
  export const Toaster: any;
  export const toast: any;
  const _default: any;
  export default _default;
}
declare module "react-hook-form" {
  export type FieldValues = any;
  export type FieldPath<T = any> = any;
  export type ControllerProps<T = any, N = any> = any;
  export type UseFormReturn<T = any> = any;
  export const Controller: any;
  export const FormProvider: any;
  export function useFormState<T = any>(...args: any[]): any;
  export function useController<T = any>(...args: any[]): any;
  export function useWatch<T = any>(...args: any[]): any;
  const _default: any;
  export default _default;
}
declare module "react-hook-form" {
  export type FieldValues = any;
  export type FieldPath<T = any> = any;
  export type ControllerProps<T = any, N = any> = any;
  export type UseFormReturn<T = any> = any;
  export const Controller: any;
  export const FormProvider: any;
  export function useForm<T = any>(...args: any[]): any;
  export function useFormContext<T = any>(...args: any[]): any;
  export function useFormState<T = any>(...args: any[]): any;
  export function useController<T = any>(...args: any[]): any;
  export function useWatch<T = any>(...args: any[]): any;
  const _default: any;
  export default _default;
}
declare module "embla-carousel-react" {
  export type UseEmblaCarouselType = [any, any];
  const useEmblaCarousel: (...args: any[]) => UseEmblaCarouselType;
  export default useEmblaCarousel;
}
declare module "embla-carousel-react" {
  export type UseEmblaCarouselType = [any, any];
  const useEmblaCarousel: (...args: any[]) => UseEmblaCarouselType;
  export default useEmblaCarousel;
}
declare module "recharts" {
  export type LegendProps = any;
  export type TooltipProps<A = any, B = any> = any;
  const RechartsPrimitive: any;
  export default RechartsPrimitive;
  export const Legend: any;
  export const Tooltip: any;
  export const ResponsiveContainer: any;
}
declare module "recharts" {
  export type LegendProps = any;
  export type TooltipProps<A = any, B = any> = any;
  const RechartsPrimitive: any;
  export default RechartsPrimitive;
  export const Legend: any;
  export const Tooltip: any;
  export const ResponsiveContainer: any;
}

// Catch-all for the remaining Figma Make version-suffixed aliases and any
// other bare specifier we don't declare above.
declare module "*";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element {
    [key: string]: any;
  }
  interface ElementClass {
    render: any;
  }
  interface ElementAttributesProperty {
    props: any;
  }
  interface ElementChildrenAttribute {
    children: any;
  }
  interface IntrinsicAttributes {
    key?: any;
    ref?: any;
    [key: string]: any;
  }
  interface IntrinsicClassAttributes<T = any> {
    key?: any;
    ref?: any;
    [key: string]: any;
  }
  interface LibraryManagedAttributes<C, P> {
    key?: any;
    ref?: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
