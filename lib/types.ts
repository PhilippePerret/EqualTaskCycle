

export type RecType = {[x: string]: any};

export interface WorkType {
    id: string;
    project: string;
    content: string;
    folder: string; // Required (to watch activity)
    duration?: number;
    script?: string; // path du script de démarrage
    active?: boolean;
}
export const WorkProps = ['active', 'id','project', 'content', 'duration','folder', 'script'];

export interface RunTimeInfosType {
  totalTime: number;  // Le nombre total de minutes de travail
  cycleTime: number;  // Le nombre de minutes travaillées dans le cycle courant
  restTime: number;   // Nombre de minutes restant pour finir le cycle
  cycleCount: number; // Nombre de cycles
  startedAt: number;  // Date de démarrage du travail
  lastWorkedAt: number; // Date de dernier travail
}

export interface PrefsDataType {
  file?: string;
  clock: 'mini' | 'medium' | 'big';
  theme: 'dark' | 'light';
  random: boolean;
  shortest: boolean; 
  counter: 'clock' | 'countdown';
}
