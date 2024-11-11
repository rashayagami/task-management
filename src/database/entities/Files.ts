import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum Degree {
  LAZYLOAD = 0,
  EAGERLOAD = 1,
  FORCELOAD = 2,
}

export enum Status {
    LOCAL_ONLY = 0,
    SYNCED = 1,
    SERVER_ONLY = 2,
}


@Entity('files')
export class Files extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  key: string;

  @Column('simple-json', { nullable: true })
  metadata?: string;

  @Column('integer', { default: Degree.LAZYLOAD })
  degree: number;
  
  @Column('text', { default: 'global' })
  bucket_id: string;
    
  @Column('integer', { default: Status.SERVER_ONLY })
  synced: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('uuid', { nullable: false })
  last_updated_by: string | null; // Stores the UUID of the user who last updated the record
}
