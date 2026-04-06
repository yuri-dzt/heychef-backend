import { ITableRepository } from '../../contracts/table';
import { NotFoundError } from '../../shared/errors';

interface DeleteTableInput {
  organizationId: string;
  tableId: string;
}

export class DeleteTableUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(input: DeleteTableInput): Promise<void> {
    const existing = await this.tableRepository.findById(input.organizationId, input.tableId);

    if (!existing) {
      throw new NotFoundError('Table');
    }

    await this.tableRepository.delete(input.organizationId, input.tableId);
  }
}
