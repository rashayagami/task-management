import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity("contact_details")
  export class BulkChillerOfficer {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;
  
    @Column({ name: "contact_email", type: "text", nullable: true })
    contact_email: string;
  
    @Column({ name: "phone_number", type: "integer" })
    phone_number: number;
  
    @Column({ name: "date_of_association", type: "text" }) 
    date_of_association: string;
  
    @Column({ name: "alternate_phone_number", type: "integer", nullable: true })
    alternate_phone_number: number;
  
    @Column({ name: "capacity", type: "integer" }) 
    capacity: number;
  
    @Column({ name: "bulk_chiller_officer", type: "text" })
    bulk_chiller_officer: string;
  
    @Column({ name: "location", type: "text" })
    location: string;
  
    @Column({ name: "bank_account_number", type: "text" })
    bank_account_number: string;
  
    @Column({ name: "bank_details", type: "simple-json" }) 
    bank_details: string;
  
    @Column({ type: "int", default: 0})
    is_deleted?: number;
  
    @Column({ type: "uuid", nullable: true})
    tx_ref_id?: string;
  
    @Column({ type: "date", nullable: true})
    sync_at?: Date;
  
    @Column({ type: "simple-json", nullable: true})
    additional_information?: object;
  
    @Column({ type: "uuid", nullable: true})
    last_modified_by?: string;
  }
  
