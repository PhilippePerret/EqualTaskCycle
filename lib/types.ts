

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
  totalTime: number;  // Le nombre total de minutes de travail
  cycleTime: number;  // Le nombre de minutes travaillées dans le cycle courant
  restTime: number;   // Nombre de minutes restant pour finir le cycle
  cycleCount: number; // Nombre de cycles
  startedAt: Date;    // Date de démarrage du travail
  lastWorkedAt: Date; // Date de dernier travail
}

export interface PrefsDataType {
  file?: string;
  clock: 'mini' | 'mediane' | 'big';
  theme: 'dark' | 'light';
  random: boolean;
}
