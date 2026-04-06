import { ITableRepository } from '../../contracts/table';
import { TableMapper } from '../../contracts/table';
import { TableDTO } from '../../contracts/table/dto';

interface ListTablesInput {
  organizationId: string;
}

export class ListTablesUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(input: ListTablesInput): Promise<TableDTO[]> {
    const tables = await this.tableRepository.findAllByOrg(input.organizationId);
    return tables.map(TableMapper.toDTO);
  }
}
