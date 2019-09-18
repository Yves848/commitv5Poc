import { ProjectFile } from '../src/models/IProject';

export interface OptionsPHA {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  lowercase_keys: boolean;
  role: any;
  pageSize: number;
  commit: ProjectFile;
}
