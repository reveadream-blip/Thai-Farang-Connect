/** Types alignés sur la réponse API `/v1/projects`. */

export type ApiProject = {
  id: string;
  title_en: string;
  title_th: string;
  description_en: string;
  description_th: string;
  industry: string;
  location: string;
  required_investment: number | null;
  equity_offered: number | null;
  status: string;
  created_at: string;
};

export type ApiProjectsResponse = {
  projects: ApiProject[];
};

/** Réponse `GET /v1/manage/projects/:id` (inclut `owner_id`). */
export type ApiManageProject = ApiProject & {
  owner_id: string | null;
};
