type InitialData = {
    staticUrl: string;
    baseUrl: string;
}

declare const LogicLearner: InitialData;

declare module '*jpg' {
    const content: string;
    export default content;
}

declare module '*png' {
    const content: string;
    export default content;
}

declare module '*svg' {
    const content: string;
    export default content;
}

declare module '*css' {
    const content: string;
    export default content;
}

declare const __BUILD__: string;
