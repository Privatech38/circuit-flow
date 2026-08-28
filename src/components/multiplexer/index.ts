import {Multiplexer} from "@/components/multiplexer/Multiplexer.tsx";

export const MultiplexerType = {
    MUX: "multiplexer",
} as const;

export type MultiplexerType = typeof MultiplexerType[keyof typeof MultiplexerType];

export const multiplexerTypes = {
    multiplexer: Multiplexer.component,
}
