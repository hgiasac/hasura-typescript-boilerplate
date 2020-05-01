import DateType from "./Date";
import EmailType from "./Email";
import UUIDType from "./UUID";
import { rangeScalaTypes, MaxLength, MinLength } from "./Validators";
import { createCustomScalars } from "./types";

export const gqlCustomScalars = createCustomScalars([
  DateType,
  EmailType,
  UUIDType,
  ...rangeScalaTypes(MinLength, 10),
  ...rangeScalaTypes(MaxLength, 10)
]);
