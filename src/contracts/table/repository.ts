import { TableEntity } from "../../domain/table";

export interface ITableRepository {
  findById(organizationId: string, id: string): Promise<TableEntity | null>;
  findByToken(qrCodeToken: string): Promise<TableEntity | null>;
  findAllByOrg(organizationId: string): Promise<TableEntity[]>;
  create(organizationId: string, table: TableEntity): Promise<TableEntity>;
  update(organizationId: string, table: TableEntity): Promise<TableEntity>;
  delete(organizationId: string, id: string): Promise<void>;
}
