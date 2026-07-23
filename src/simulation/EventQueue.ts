import type {Node} from "@xyflow/react";
import Queue from "yocto-queue";

export const EventQueue: Queue<Node> = new Queue();