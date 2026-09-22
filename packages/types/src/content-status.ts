/**
 * Estados possíveis para conteúdos administráveis do CMS (páginas, soluções,
 * projetos, artigos etc). Usado tanto pela API (Prisma enum) quanto pelos
 * frontends (website/admin) para manter o contrato em sincronia.
 */
export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
}
