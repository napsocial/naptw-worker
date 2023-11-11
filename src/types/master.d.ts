export type AdvanceOptionNames = 'iep' | 'ep';
export interface AdvanceOption {
    isEP?: boolean,  // is expired timesting use
    ep?: number,     // Expired timestring
    cu?: string      // Custom url
}