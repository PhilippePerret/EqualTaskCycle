

export type RecType = {[x: string]: any};

export interface WorkType {
    id: string,
    project: string,
    content: string,
    duration?: number,
    folder?: string,
    startupScript?: string, // path du script de démarrage
}

export interface RunTimeInfosType {
  workedTime: number; // nombre de secondes de travail
  lastTime?: Date; //
}

export interface PrefsDataType {
  file?: string;
  clock: 'mini' | 'mediane' | 'big';
  theme: 'dark' | 'light';
  random: boolean;
}
