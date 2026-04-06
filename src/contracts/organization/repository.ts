import { Organization } from "../../domain/organization";

export interface IOrganizationRepository {
  findById(organizationId: string): Promise<Organization | null>;
  findAll(): Promise<Organization[]>;
  create(organization: Organization): Promise<Organization>;
  update(organization: Organization): Promise<Organization>;
}
