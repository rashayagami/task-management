import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

enum Degree {
  LAZYLOAD = 0,
  EAGERLOAD = 1,
  FORCELOAD = 2,
}

enum Status {
    LOCAL_ONLY = 0,
    SYNCED = 1,
    SERVER_ONLY = 2,
}


@Entity('files')
export class File extends BaseEntity {
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
}
