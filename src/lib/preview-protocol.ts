export const PREVIEW_SOURCE = "few-clicks-preview";

export type ReadyMessage = {
  source: typeof PREVIEW_SOURCE;
  type: "ready";
};

export type DataMessage<TData> = {
  source: typeof PREVIEW_SOURCE;
  type: "data";
  payload: TData;
};

export type PreviewMessage<TData> = ReadyMessage | DataMessage<TData>;

export const isPreviewMessage = (
  msg: unknown,
): msg is PreviewMessage<unknown> => {
  if (typeof msg !== "object" || msg === null) return false;
  const candidate = msg as { source?: unknown; type?: unknown };
  if (candidate.source !== PREVIEW_SOURCE) return false;
  return candidate.type === "ready" || candidate.type === "data";
};
