import { ITableRepository } from '../../contracts/table';
import { TableMapper } from '../../contracts/table';
import { TableEntity } from '../../domain/table';
import { NotFoundError } from '../../shared/errors';
import { TableDTO } from '../../contracts/table/dto';

interface UpdateTableInput {
  organizationId: string;
  tableId: string;
  name?: string;
  active?: boolean;
}

export class UpdateTableUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(input: UpdateTableInput): Promise<TableDTO> {
    const existing = await this.tableRepository.findById(input.organizationId, input.tableId);

    if (!existing) {
      throw new NotFoundError('Table');
    }

    const now = Date.now();

    const updated = new TableEntity({
      id: existing.id,
      organizationId: existing.organizationId,
      name: input.name ?? existing.name,
      qrCodeToken: existing.qrCodeToken,
      active: input.active ?? existing.active,
      createdAt: existing.createdAt,
      updatedAt: now,
    });

    const saved = await this.tableRepository.update(input.organizationId, updated);

    return TableMapper.toDTO(saved);
  }
}
