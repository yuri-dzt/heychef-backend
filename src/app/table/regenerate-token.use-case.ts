import { v4 as uuidv4 } from 'uuid';
import { ITableRepository } from '../../contracts/table';
import { TableMapper } from '../../contracts/table';
import { TableEntity } from '../../domain/table';
import { NotFoundError } from '../../shared/errors';
import { TableDTO } from '../../contracts/table/dto';

interface RegenerateTokenInput {
  organizationId: string;
  tableId: string;
}

export class RegenerateTokenUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(input: RegenerateTokenInput): Promise<TableDTO> {
    const existing = await this.tableRepository.findById(input.organizationId, input.tableId);

    if (!existing) {
      throw new NotFoundError('Table');
    }

    const now = Date.now();

    const updated = new TableEntity({
      id: existing.id,
      organizationId: existing.organizationId,
      name: existing.name,
      qrCodeToken: uuidv4(),
      active: existing.active,
      createdAt: existing.createdAt,
      updatedAt: now,
    });

    const saved = await this.tableRepository.update(input.organizationId, updated);

    return TableMapper.toDTO(saved);
  }
}
