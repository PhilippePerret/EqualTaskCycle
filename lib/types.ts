

export type RecType = {[x: string]: any};

export interface WorkType {
    id: string,
    name: string,
    content: string,
    duration?: number,
    folder?: string,
    startupScript?: string, // path du script de démarrage
}

export interface RunTimeInfosType {
  workedTime: number; // nombre de secondes de travail
  lastTime?: Date; //
}