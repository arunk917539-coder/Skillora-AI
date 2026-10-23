export type ArchitectureLayerId =
  | "frontend"
  | "auth"
  | "backend"
  | "ai_pipeline"
  | "database";

export type ComponentStatus = "implemented" | "runtime_verified" | "proposed";

export interface TechComponent {
  id: string;
  name: string;
  layer: ArchitectureLayerId;
  techStack: string[];
  filePath: string;
  summary: string;
  responsibility: string;
  inputDescription: string;
  outputDescription: string;
  dependencies: string[];
  status: ComponentStatus;
  keyFunctions?: string[];
  sampleSnippet?: string;
  position: { x: number; y: number; colSpan?: number };
}

export type ConnectionType = "request" | "response" | "database" | "ai_inference" | "internal";

export interface DataConnection {
  fromId: string;
  toId: string;
  label: string;
  type: ConnectionType;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  activeComponentIds: string[];
  activeConnection?: DataConnection;
  description: string;
  whyItMatters: string;
  whatHappensNext: string;
  verifiedStatus: ComponentStatus;
  sourceFiles: Array<{ path: string; lines?: string; note?: string }>;
  samplePayload?: {
    title: string;
    type: "request" | "response" | "database_query" | "llm_prompt" | "llm_output" | "internal";
    content: string;
  };
}

export interface SimulationScenario {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  badge: string;
  summary: string;
  totalSteps: number;
  highlightedLayers: ArchitectureLayerId[];
  steps: SimulationStep[];
  keyTakeaways: string[];
}
