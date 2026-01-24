declare module 'prismjs/components/prism-core' {
    export function highlight(text: string, grammar: any, language: string): string;
    export const languages: { [key: string]: any };
}
declare module 'prismjs/components/prism-python' {}
