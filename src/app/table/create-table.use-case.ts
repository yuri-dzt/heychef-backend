import { v4 as uuidv4 } from 'uuid';
import { ITableRepository } from '../../contracts/table';
import { TableMapper } from '../../contracts/table';
import { TableEntity } from '../../domain/table';
import { TableDTO } from '../../contracts/table/dto';

interface CreateTableInput {
  organizationId: string;
  name: string;
}

export class CreateTableUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(input: CreateTableInput): Promise<TableDTO> {
    const now = Date.now();

    const table = new TableEntity({
      id: uuidv4(),
      organizationId: input.organizationId,
      name: input.name,
      qrCodeToken: uuidv4(),
      active: true,
      createdAt: now,
    });

    const created = await this.tableRepository.create(input.organizationId, table);

    return TableMapper.toDTO(created);
  }
}
