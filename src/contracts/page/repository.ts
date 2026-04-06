import { PageEntity } from "../../domain/page";

export interface IPageRepository {
  findById(organizationId: string, id: string): Promise<PageEntity | null>;
  findByName(organizationId: string, name: string): Promise<PageEntity | null>;
  findAllByOrg(organizationId: string): Promise<PageEntity[]>;
  create(organizationId: string, page: PageEntity): Promise<PageEntity>;
}
