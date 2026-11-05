import { TErrorSource, TGenericErrorResponse } from "./handleZodError";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSource[] = [
    {
      path: "",
      message: `${extractedMessage || "Resource"} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate key error",
    errorSources,
  };
};
