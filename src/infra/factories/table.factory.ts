import { PrismaTableRepository } from '../repositories/table.repository';
import { ListTablesUseCase } from '../../app/table/list-tables.use-case';
import { CreateTableUseCase } from '../../app/table/create-table.use-case';
import { UpdateTableUseCase } from '../../app/table/update-table.use-case';
import { DeleteTableUseCase } from '../../app/table/delete-table.use-case';
import { RegenerateTokenUseCase } from '../../app/table/regenerate-token.use-case';
import { TableController } from '../controllers/table.controller';

export function makeTableController(): TableController {
  const repository = new PrismaTableRepository();

  const listTablesUseCase = new ListTablesUseCase(repository);
  const createTableUseCase = new CreateTableUseCase(repository);
  const updateTableUseCase = new UpdateTableUseCase(repository);
  const deleteTableUseCase = new DeleteTableUseCase(repository);
  const regenerateTokenUseCase = new RegenerateTokenUseCase(repository);

  return new TableController(
    listTablesUseCase,
    createTableUseCase,
    updateTableUseCase,
    deleteTableUseCase,
    regenerateTokenUseCase,
  );
}
