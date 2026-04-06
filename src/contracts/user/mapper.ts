import { User, Role } from "../../domain/user";
import { Role as PrismaRole } from "@prisma/client";
import { UserDTO } from "./dto";

export class UserMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    created_at: bigint;
    updated_at: bigint | null;
  }): User {
    return new User({
      id: prisma.id,
      organizationId: prisma.organization_id,
      name: prisma.name,
      email: prisma.email,
      passwordHash: prisma.password_hash,
      role: prisma.role as Role,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: User): UserDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      name: domain.name,
      email: domain.email,
      role: domain.role,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: User): {
    id: string;
    organization_id: string;
    name: string;
    email: string;
    password_hash: string;
    role: PrismaRole;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      name: domain.name,
      email: domain.email,
      password_hash: domain.passwordHash,
      role: domain.role as PrismaRole,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
