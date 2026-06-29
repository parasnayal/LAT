export type LatLookupItem = {
  id: number;
  name: string;
  isActive?: boolean;
};

export type LatSchoolLookupItem = LatLookupItem & {
  regionId: number;
};

export type LatSubjectLookupItem = LatLookupItem & {
  gradeId?: number;
};

export type LatApiEnvelope<TResponse> = {
  status: number;
  errorCode?: string;
  message?: string;
  response?: TResponse;
};
